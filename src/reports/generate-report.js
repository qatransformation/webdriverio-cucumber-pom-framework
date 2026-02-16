const report = require('multiple-cucumber-html-reporter');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { getExecutionDir, getExecutionTimestamp } = require('./execution-timestamp');

// Get current execution directory
const executionDir = getExecutionDir();
const executionTimestamp = getExecutionTimestamp();

// Helper function to get human-readable OS name
function getOSName() {
  const platform = process.platform;
  const osMap = {
    'darwin': 'macOS',
    'win32': 'Windows',
    'linux': 'Linux',
    'freebsd': 'FreeBSD',
    'openbsd': 'OpenBSD',
    'sunos': 'SunOS'
  };
  return osMap[platform] || platform;
}

console.log(`📊 Generating report for execution: ${executionTimestamp}`);
console.log(`📁 Using directory: ${executionDir}`);

// Check if JSON files exist
const cucumberJson = path.join(executionDir, 'cucumber-report.json');

if (!fs.existsSync(cucumberJson)) {
  console.log('⚠️  Warning: No cucumber-report.json found. Checking for other JSON files...');
  
  // Check for any JSON files
  const files = fs.readdirSync(executionDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log(`❌ No JSON files found in ${executionDir}. Report cannot be generated.`);
    process.exit(0);
  }
}

// Function to embed videos in the cucumber JSON
function embedVideosInReport() {
  const jsonData = JSON.parse(fs.readFileSync(cucumberJson, 'utf8'));
  const videosDir = path.join(executionDir, 'videos');
  
  if (!fs.existsSync(videosDir)) {
    console.log('⚠️  No videos directory found');
    return;
  }

  const videos = fs.readdirSync(videosDir).filter(f => f.endsWith('.webm'));
  console.log(`📹 Found ${videos.length} video(s)`);

  // Embed videos in each scenario
  jsonData.forEach(feature => {
    feature.elements.forEach(scenario => {
      // Find matching video for this scenario
      const scenarioName = scenario.name.replace(/[^a-zA-Z0-9]/g, '-');
      const matchingVideo = videos.find(v => v.includes(scenarioName));
      
      if (matchingVideo) {
        const videoPath = `videos/${matchingVideo}`;
        
        // Create video embedding HTML
        const videoEmbedding = {
          data: `<div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
  <h3 style="margin-top: 0; color: #333;">🎥 Video Recording</h3>
  <video width="100%" controls preload="metadata" style="max-width: 900px; border: 2px solid #ddd; border-radius: 8px; background: #000;">
    <source src="${videoPath}" type="video/webm">
    Your browser does not support the video tag.
  </video>
  <p style="margin-top: 10px;">
    <a href="${videoPath}" download="${matchingVideo}" style="color: #007bff; text-decoration: none;">
      ⬇️ Download Video (${matchingVideo})
    </a>
  </p>
</div>`,
          mime_type: 'text/html',
          name: 'Video Recording'
        };
        
        // Find all After hooks
        const afterHooks = scenario.steps.filter(s => s.keyword === 'After');
        
        if (afterHooks.length > 0) {
          // Add to the last After hook
          const lastAfter = afterHooks[afterHooks.length - 1];
          if (!lastAfter.embeddings) {
            lastAfter.embeddings = [];
          }
          lastAfter.embeddings.push(videoEmbedding);
        } else {
          // Add a new After step with video
          scenario.steps.push({
            keyword: 'After',
            hidden: true,
            result: { status: 'passed', duration: 0 },
            embeddings: [videoEmbedding]
          });
        }
        
        console.log(`  ✅ Embedded video for: ${scenario.name}`);
      }
    });
  });

  // Save modified JSON
  const modifiedJsonPath = path.join(executionDir, 'cucumber-report-with-videos.json');
  fs.writeFileSync(modifiedJsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`📝 Created enhanced report JSON: ${modifiedJsonPath}`);
  
  return 'cucumber-report-with-videos.json';
}

// Embed videos before generating report
// const reportJsonFile = embedVideosInReport() || 'cucumber-report.json';
// Videos are now injected directly in HTML by post-process-report.js
const reportJsonFile = 'cucumber-report.json';

// Remove old cucumber-report-with-videos.json if exists
const oldJsonPath = path.join(executionDir, 'cucumber-report-with-videos.json');
if (fs.existsSync(oldJsonPath)) {
  fs.unlinkSync(oldJsonPath);
  console.log('🗑️  Removed old cucumber-report-with-videos.json');
}

// Calculate total test duration
function calculateTotalDuration() {
  try {
    const jsonData = JSON.parse(fs.readFileSync(cucumberJson, 'utf8'));
    let totalDurationMs = 0;
    let totalScenarios = 0;
    
    jsonData.forEach(feature => {
      feature.elements.forEach(scenario => {
        totalScenarios++;
        // Sum all step durations in the scenario
        scenario.steps.forEach(step => {
          if (step.result && step.result.duration) {
            totalDurationMs += step.result.duration / 1000000; // Convert nanoseconds to milliseconds
          }
        });
      });
    });
    
    const totalSeconds = (totalDurationMs / 1000).toFixed(2);
    const minutes = Math.floor(totalDurationMs / 60000);
    const seconds = ((totalDurationMs % 60000) / 1000).toFixed(2);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s (${totalScenarios} scenarios)`;
    } else {
      return `${totalSeconds}s (${totalScenarios} scenarios)`;
    }
  } catch (error) {
    console.log('⚠️  Could not calculate total duration:', error.message);
    return 'N/A';
  }
}

const totalDuration = calculateTotalDuration();

// Check if videos and screenshots exist
const videosDir = path.join(executionDir, 'videos');
const screenshotsDir = path.join(executionDir, 'screenshots');
const hasVideos = fs.existsSync(videosDir) && fs.readdirSync(videosDir).filter(f => f.endsWith('.webm')).length > 0;
const hasScreenshots = fs.existsSync(screenshotsDir) && fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png')).length > 0;

// Determine evidence status
let evidenceStatus = '';
if (hasVideos && hasScreenshots) {
  evidenceStatus = '✅ Videos + Screenshots';
} else if (hasVideos) {
  evidenceStatus = '✅ Videos only';
} else if (hasScreenshots) {
  evidenceStatus = '✅ Screenshots only';
} else {
  evidenceStatus = '❌ No evidence (report only)';
}

console.log(`📊 Evidence status: ${evidenceStatus}`);

// Format execution timestamp for display
const formattedDate = new Date().toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

report.generate({
  jsonDir: executionDir,
  reportPath: executionDir,
  jsonFile: reportJsonFile,
  reportName: `Execution - ${formattedDate}`,
  pageTitle: `Test Execution - ${formattedDate}`,
  displayDuration: true,
  displayReportTime: true,
  openReportInBrowser: false,
  disableLog: false,
  pageFooter: '<div><p>Test Execution Report - Automation Framework | Videos Embedded</p></div>',
  metadata: {
    browser: {
      name: 'chrome',
      version: 'latest'
    },
    device: 'Desktop',
    platform: {
      name: getOSName(),
      version: os.release()
    }
  },
  customData: {
    title: 'Execution Information',
    data: [
      { label: 'Project', value: 'WebdriverIO + Cucumber + POM Framework' },
      { label: 'Framework', value: 'WebdriverIO + Cucumber + POM' },
      { label: 'Execution ID', value: executionTimestamp },
      { label: 'Date', value: formattedDate },
      { label: 'Environment', value: 'Test' },
      { label: 'Total Duration', value: totalDuration },
      { label: 'Evidence', value: evidenceStatus }
    ]
  }
});

console.log(`📊 Report location: ${executionDir}/index.html`);

// Post-process the report to inject videos (if videos exist)
console.log('\n🔧 Post-processing report...');
try {
  // Clear the require cache to ensure fresh execution
  const postProcessPath = require.resolve('./post-process-report.js');
  delete require.cache[postProcessPath];
  
  require('./post-process-report.js');
  console.log('✅ Post-processing completed');
} catch (error) {
  console.log('⚠️  Post-processing skipped:', error.message);
  console.log('✅ Report generated successfully without videos');
}

// Generate main index with execution history
console.log('\n📊 Generating main index with execution history...');
try {
  // Clear the require cache to ensure fresh execution
  const generateIndexPath = require.resolve('./generate-index.js');
  delete require.cache[generateIndexPath];
  
  require('./generate-index.js');
  console.log('✅ Main index generated successfully');
} catch (error) {
  console.error('❌ Error generating main index:', error.message);
  console.error(error.stack);
}

// Clean up timestamp file
const { cleanTimestampFile } = require('./execution-timestamp');
cleanTimestampFile();
console.log('\n✨ Report generation completed!');
