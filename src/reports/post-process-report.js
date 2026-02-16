const fs = require('fs');
const path = require('path');
const { getExecutionDir } = require('./execution-timestamp');

console.log('🔧 Post-procesando el reporte...');

const executionDir = getExecutionDir();
const reportPath = path.join(executionDir, 'index.html');
const jsonPath = path.join(executionDir, 'cucumber-report.json');

// Read the HTML report
let htmlContent = fs.readFileSync(reportPath, 'utf8');

// Read the JSON to get feature and scenario information
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Add feature file path and scenario names to Features overview table
console.log('🔧 Adding feature file paths and scenario names to Features overview table...');

// Create a map of feature names to their data
const featureDataMap = new Map();
jsonData.forEach(feature => {
  const featureName = feature.name;
  const featureUri = feature.uri; // e.g., "features/todomvc.feature"
  const scenarios = feature.elements
    .filter(el => el.type === 'scenario')
    .map(el => el.name);
  
  featureDataMap.set(featureName, {
    uri: featureUri,
    scenarios: scenarios
  });
});

// Find the Features overview table section
const featuresOverviewStart = htmlContent.indexOf('<h2>Features overview</h2>');
const featuresOverviewEnd = htmlContent.indexOf('</table>', featuresOverviewStart) + 8;

if (featuresOverviewStart === -1 || featuresOverviewEnd === -1) {
  console.log('⚠️  Could not find Features overview table');
} else {
  // Extract only the Features overview table section
  const beforeTable = htmlContent.substring(0, featuresOverviewStart);
  let tableSection = htmlContent.substring(featuresOverviewStart, featuresOverviewEnd);
  const afterTable = htmlContent.substring(featuresOverviewEnd);
  
  // Find and modify each feature row ONLY in the table section
  featureDataMap.forEach((data, featureName) => {
    // Find the feature name link in the table (without 'g' flag to replace only first occurrence)
    const featureLinkRegex = new RegExp(
      `(<a[^>]*>)${featureName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(<\\/a>)`
    );
    
    const featureInfo = `
                            <div style="margin-top: 8px; color: #6c757d; font-size: 0.875em;">
                                <div style="margin-bottom: 6px;">
                                    <i class="fa fa-file-code-o" style="margin-right: 5px;"></i>
                                    <code style="background: #f1f3f5; padding: 2px 6px; border-radius: 3px; font-size: 0.9em;">${data.uri}</code>
                                </div>
                                <div style="margin-top: 6px;">
                                    <i class="fa fa-list-ul" style="margin-right: 5px;"></i>
                                    <strong style="font-size: 0.9em;">Scenarios:</strong>
                                    <ul style="margin: 4px 0 0 20px; padding: 0; list-style: disc;">
                                        ${data.scenarios.map(s => `<li style="margin: 2px 0;">${s}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>`;
    
    // Replace only in the table section
    tableSection = tableSection.replace(featureLinkRegex, `$1${featureName}$2${featureInfo}`);
  });
  
  // Reconstruct the HTML
  htmlContent = beforeTable + tableSection + afterTable;
}

fs.writeFileSync(reportPath, htmlContent);
console.log(`✅ Added file paths and scenarios for ${featureDataMap.size} feature(s)`);

// Remove duplicate feature rows from the Features overview table
console.log('🔧 Removing duplicate features from Features overview table...');
htmlContent = fs.readFileSync(reportPath, 'utf8');

// Find the features table and remove duplicate rows
const featureNames = new Set();
const tableRowRegex = /<tr>\s*<td>\s*<a[^>]*>([^<]+)<\/a>\s*<\/td>[\s\S]*?<\/tr>/g;
let match;
const rowsToKeep = [];
const rowsToRemove = [];

while ((match = tableRowRegex.exec(htmlContent)) !== null) {
  const featureName = match[1].trim();
  const fullRow = match[0];
  
  if (!featureNames.has(featureName)) {
    featureNames.add(featureName);
    rowsToKeep.push(fullRow);
  } else {
    rowsToRemove.push(fullRow);
    console.log(`  ❌ Removing duplicate: ${featureName}`);
  }
}

// Remove duplicate rows
rowsToRemove.forEach(row => {
  htmlContent = htmlContent.replace(row, '');
});

fs.writeFileSync(reportPath, htmlContent);
console.log(`✅ Removed ${rowsToRemove.length} duplicate feature(s) from table`);

console.log('✅ Report post-processed successfully!');
console.log('📊 Videos are recorded but not embedded in reports');
console.log('📂 Videos are available in: ' + path.join(executionDir, 'videos'));
