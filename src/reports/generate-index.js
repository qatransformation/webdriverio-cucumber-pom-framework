/**
 * Generates main index.html with history of all test executions
 */

const fs = require('fs');
const path = require('path');

const executionsDir = path.join(__dirname, '../../test-results', 'executions');
const mainIndexPath = path.join(__dirname, '../../test-results', 'index.html');

console.log('📊 Generating main index with execution history...');

// Get all execution directories
if (!fs.existsSync(executionsDir)) {
  console.log('⚠️  No executions directory found');
  process.exit(0);
}

const executions = fs.readdirSync(executionsDir)
  .filter(dir => {
    const fullPath = path.join(executionsDir, dir);
    return fs.statSync(fullPath).isDirectory();
  })
  .sort()
  .reverse(); // Most recent first

console.log(`📁 Found ${executions.length} execution(s)`);

if (executions.length === 0) {
  console.log('⚠️  No valid execution directories found');
  console.log('   Make sure test-results/executions/ contains execution folders');
  process.exit(0);
}

console.log('📝 Processing executions:', executions.join(', '));

// Read execution data
const executionData = executions.map(execDir => {
  const jsonPath = path.join(executionsDir, execDir, 'cucumber-report.json');
  const reportPath = path.join(executionsDir, execDir, 'index.html');
  
  console.log(`   Checking execution: ${execDir}`);
  console.log(`   - JSON exists: ${fs.existsSync(jsonPath)}`);
  console.log(`   - Report exists: ${fs.existsSync(reportPath)}`);
  
  if (!fs.existsSync(jsonPath) || !fs.existsSync(reportPath)) {
    console.log(`   ⚠️  Skipping ${execDir} - missing files`);
    return null;
  }
  
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Calculate statistics
    let totalScenarios = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;
    let totalSteps = 0;
    let passedSteps = 0;
    let failedSteps = 0;
    let totalDuration = 0;
    
    const featureNames = [];
    
    jsonData.forEach(feature => {
      featureNames.push(feature.name);
      feature.elements.forEach(scenario => {
        totalScenarios++;
        let scenarioFailed = false;
        
        scenario.steps.forEach(step => {
          totalSteps++;
          if (step.result.status === 'passed') {
            passedSteps++;
          } else if (step.result.status === 'failed') {
            failedSteps++;
            scenarioFailed = true;
          }
          
          if (step.result.duration) {
            totalDuration += step.result.duration / 1000000000; // Convert to seconds
          }
        });
        
        if (scenarioFailed) {
          failedScenarios++;
        } else {
          passedScenarios++;
        }
      });
    });
    
    // Format timestamp for display
    const [datePart, timePart] = execDir.split('_');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split('-');
    const displayDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    
    return {
      id: execDir,
      date: displayDate,
      timestamp: execDir,
      features: featureNames.join(', '),
      totalScenarios,
      passedScenarios,
      failedScenarios,
      totalSteps,
      passedSteps,
      failedSteps,
      duration: totalDuration.toFixed(2),
      status: failedScenarios > 0 ? 'failed' : 'passed',
      reportPath: `executions/${execDir}/index.html`
    };
  } catch (error) {
    console.error(`⚠️  Error reading execution ${execDir}:`, error.message);
    return null;
  }
}).filter(Boolean);

console.log(`✅ Successfully processed ${executionData.length} execution(s)`);

if (executionData.length === 0) {
  console.log('⚠️  No valid execution data found - cannot generate index');
  process.exit(0);
}

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TodoMVC - Test Execution History</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
  <style>
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .main-header {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .main-header h1 {
      color: #667eea;
      margin: 0;
      font-weight: 700;
    }
    .main-header p {
      color: #666;
      margin: 10px 0 0 0;
    }
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card h3 {
      color: #667eea;
      font-size: 2.5em;
      margin: 0;
      font-weight: 700;
    }
    .stat-card p {
      color: #666;
      margin: 10px 0 0 0;
      font-size: 0.9em;
    }
    .executions-table {
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .executions-table h2 {
      color: #667eea;
      margin: 0 0 20px 0;
      font-weight: 700;
    }
    .table {
      margin: 0;
    }
    .table thead th {
      background: #667eea;
      color: white;
      border: none;
      font-weight: 600;
    }
    .table tbody tr:hover {
      background: #f8f9fa;
    }
    .badge-passed {
      background: #28a745;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.85em;
    }
    .badge-failed {
      background: #dc3545;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.85em;
    }
    .view-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 5px;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s;
      margin-right: 5px;
    }
    .view-btn:hover {
      background: #5568d3;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    .no-executions {
      text-align: center;
      padding: 50px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="main-header">
      <h1>🎯 TodoMVC - Test Execution History</h1>
      <p>Complete history of automated test executions with detailed reports</p>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <h3>${executionData.length}</h3>
        <p>Total Executions</p>
      </div>
      <div class="stat-card">
        <h3>${executionData.filter(e => e.status === 'passed').length}</h3>
        <p>Passed Executions</p>
      </div>
      <div class="stat-card">
        <h3>${executionData.filter(e => e.status === 'failed').length}</h3>
        <p>Failed Executions</p>
      </div>
      <div class="stat-card">
        <h3>${executionData.length > 0 ? executionData[0].date.split(' ')[0] : 'N/A'}</h3>
        <p>Last Execution</p>
      </div>
    </div>

    <div class="executions-table">
      <h2>📋 Execution History</h2>
      ${executionData.length === 0 ? `
        <div class="no-executions">
          <h3>No executions found</h3>
          <p>Run your tests to generate execution reports</p>
        </div>
      ` : `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Execution</th>
              <th>Date & Time</th>
              <th>Features</th>
              <th>Scenarios</th>
              <th>Steps</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${executionData.map((exec, index) => `
              <tr id="exec-${exec.id}">
                <td><strong>#${executionData.length - index}</strong></td>
                <td>${exec.date}</td>
                <td><small>${exec.features}</small></td>
                <td>
                  <span class="text-success">${exec.passedScenarios} ✓</span> /
                  <span class="text-danger">${exec.failedScenarios} ✗</span> /
                  <span class="text-muted">${exec.totalScenarios} total</span>
                </td>
                <td>
                  <span class="text-success">${exec.passedSteps} ✓</span> /
                  <span class="text-danger">${exec.failedSteps} ✗</span> /
                  <span class="text-muted">${exec.totalSteps} total</span>
                </td>
                <td>${exec.duration}s</td>
                <td>
                  <span class="badge-${exec.status}">
                    ${exec.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <a href="${exec.reportPath}" class="view-btn" target="_blank">
                    View Report
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

// Write main index
console.log(`💾 Writing main index to: ${mainIndexPath}`);
fs.writeFileSync(mainIndexPath, html);
console.log(`✅ Main index generated successfully`);
console.log(`📊 Total executions listed: ${executionData.length}`);
console.log(`📍 Open at: ${mainIndexPath}`);
