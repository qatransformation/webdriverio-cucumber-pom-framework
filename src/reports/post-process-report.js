const fs = require('fs');
const path = require('path');
const { getExecutionDir } = require('./execution-timestamp');

console.log('🔧 Post-procesando el reporte para insertar videos...');

const executionDir = getExecutionDir();
const reportPath = path.join(executionDir, 'index.html');
const jsonPath = path.join(executionDir, 'cucumber-report.json');
const videosDir = path.join(executionDir, 'videos');

// Read the HTML report
let htmlContent = fs.readFileSync(reportPath, 'utf8');

// Read the JSON to get scenario names
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Get video files
if (!fs.existsSync(videosDir)) {
  console.log('⚠️  No videos directory found - Skipping video embedding');
  console.log('✅ Report generated successfully without videos');
  process.exit(0);
}

const videos = fs.readdirSync(videosDir).filter(f => f.endsWith('.webm'));

if (videos.length === 0) {
  console.log('⚠️  No video files found - Skipping video embedding');
  console.log('✅ Report generated successfully without videos');
  process.exit(0);
}

console.log(`📹 Found ${videos.length} video(s) to embed`);

// Create a mapping of scenarios to videos
const scenarioVideos = [];
const usedVideos = new Set(); // Track which videos have been matched

jsonData.forEach(feature => {
  feature.elements.forEach(scenario => {
    // Normalize scenario name for matching
    const scenarioName = scenario.name.replace(/[^a-zA-Z0-9]/g, '-');
    
    // Find ALL videos that match this scenario name
    // For Scenario Outlines, multiple videos will have the same base name with different indices
    const matchingVideos = videos.filter(v => {
      // Check if video name starts with the scenario name
      // and hasn't been used yet
      const videoBaseName = v.split('-0-')[0]; // Get base name before example index
      const scenarioBaseName = scenarioName.split('-').slice(0, -1).join('-') || scenarioName;
      return v.includes(scenarioName) && !usedVideos.has(v);
    });
    
    // Add all matching videos for this scenario
    matchingVideos.forEach(matchingVideo => {
      scenarioVideos.push({
        name: scenario.name,
        video: matchingVideo,
        id: scenario.id
      });
      usedVideos.add(matchingVideo);
    });
  });
});

console.log(`📝 Matched ${scenarioVideos.length} video(s) to scenarios`);

// CSS for videos (will be injected in feature files only)
const customCSS = `
<style>
.video-container {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}
.video-container h4 {
  margin-top: 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
}
.video-player {
  width: 100%;
  max-width: 900px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  background: #000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.video-download {
  margin-top: 10px;
  display: inline-block;
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}
.video-download:hover {
  text-decoration: underline;
}
/* Ocultar la palabra After en los hooks */
.keyword.highlight:has-text("After") {
  display: none;
}
span.keyword.highlight {
  font-size: 0;
}
span.keyword.highlight::before {
  font-size: 13px;
  content: attr(data-label);
}
</style>
`;

// NOTE: DO NOT inject videos in the main execution index.html
// Videos will only be injected in individual feature HTML files below
console.log('ℹ️  Skipping video injection in main index.html (videos only in feature files)');

// Inject videos directly into feature HTML files
const featuresDir = path.join(executionDir, 'features');
const featureFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.html'));
console.log(`📄 Processing ${featureFiles.length} feature file(s)...`);

let videosInjected = 0;

featureFiles.forEach(featureFile => {
  const featurePath = path.join(featuresDir, featureFile);
  let featureHtml = fs.readFileSync(featurePath, 'utf8');
  
  // Insert CSS if not present
  if (!featureHtml.includes('video-container')) {
    featureHtml = featureHtml.replace('</head>', customCSS + '</head>');
  }
  
  // Insert videos for each scenario in this feature
  scenarioVideos.forEach(sv => {
    // Only inject if not already present
    if (featureHtml.includes(sv.video)) {
      return;
    }
    
    // Look for the scenario name and find the collapse div that contains logs
    const scenarioNameIndex = featureHtml.indexOf(sv.name);
    if (scenarioNameIndex === -1) {
      return;
    }
    
    // Find the collapse div with logs (class="scenario-step-collapse collapse")
    const afterName = featureHtml.substring(scenarioNameIndex);
    const collapseMatch = afterName.match(/<div id="([^"]+)" class="scenario-step-collapse collapse">/);
    
    if (!collapseMatch) {
      return;
    }
    
    const collapseId = collapseMatch[1];
    const collapseStartIndex = scenarioNameIndex + collapseMatch.index;
    
    // Find the end of this collapse div
    let depth = 0;
    let collapseEndIndex = collapseStartIndex + collapseMatch[0].length;
    let inDiv = true;
    
    for (let i = collapseEndIndex; i < featureHtml.length && inDiv; i++) {
      if (featureHtml.substring(i, i + 5) === '<div ') {
        depth++;
      } else if (featureHtml.substring(i, i + 6) === '</div>') {
        if (depth === 0) {
          collapseEndIndex = i + 6;
          inDiv = false;
        } else {
          depth--;
        }
      }
    }
    
    // Create a new collapse ID for the video
    const videoCollapseId = collapseId.replace('-text', '-video');
    
    // Create the video collapse HTML
    const videoCollapseHtml = `

                                <div id="${videoCollapseId}" class="scenario-step-collapse collapse">
                                    <div class="video-container" style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
  <h4 style="margin-top: 0; color: #495057; font-size: 16px; font-weight: 600;">&#127909; Video Recording</h4>
  <video class="video-player" controls preload="metadata" style="width: 100%; max-width: 900px; border: 2px solid #dee2e6; border-radius: 6px; background: #000; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <source src="../videos/${sv.video}" type="video/webm">
    Your browser does not support the video tag.
  </video>
  <div style="margin-top: 10px;">
    <a href="../videos/${sv.video}" download="${sv.video}" style="display: inline-block; color: #007bff; text-decoration: none; font-size: 14px;">Download Video</a>
  </div>
</div>
                                </div>
`;
    
    // Find the "+ Show Info" link that points to this collapse
    const linkPattern = new RegExp(`<a href="#${collapseId}"[^>]*>\\+ Show Info</a>`);
    const linkMatch = featureHtml.match(linkPattern);
    
    if (linkMatch) {
      const linkIndex = featureHtml.indexOf(linkMatch[0]);
      const afterLink = linkMatch[0];
      
      // Create the "+ View Video" link
      const videoLink = `
                                        <a href="#${videoCollapseId}" data-bs-toggle="collapse" style="color: #28a745; font-weight: 500;">+ View Video</a>
`;
      
      // Insert the video link after the Show Info link
      featureHtml = featureHtml.substring(0, linkIndex + afterLink.length) + 
                    videoLink + 
                    featureHtml.substring(linkIndex + afterLink.length);
      
      // Adjust collapseEndIndex due to the inserted link
      collapseEndIndex += videoLink.length;
    }
    
    // Insert the video collapse after the logs collapse
    featureHtml = featureHtml.substring(0, collapseEndIndex) + 
                  videoCollapseHtml + 
                  featureHtml.substring(collapseEndIndex);
    
    videosInjected++;
    console.log(`  ✅ Injected video collapse for: ${sv.name}`);
  });
  
  // Hide all "After" keywords
  featureHtml = featureHtml.replace(
    /<span class="keyword highlight">After<\/span>/g,
    '<span class="keyword highlight" style="display: none;">After</span>'
  );
  
  fs.writeFileSync(featurePath, featureHtml);
});

console.log(`📹 Total videos injected in feature files: ${videosInjected}`);

// Add feature file path and scenario names to Features overview table
console.log('🔧 Adding feature file paths and scenario names to Features overview table...');
htmlContent = fs.readFileSync(reportPath, 'utf8');

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

// Remove duplicate feature rows from the Features overview table in index.html
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
console.log('📊 Report location: test-results/index.html');
console.log('🎥 Videos will be visible when you open the report');
