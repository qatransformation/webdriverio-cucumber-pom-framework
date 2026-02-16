# 📊 Reports with Videos - WebdriverIO + Cucumber

## 📹 Video Recording

Videos are automatically recorded for all test executions. Video files are saved in `.webm` format and embedded directly in the HTML report.

- **Location:** `test-results/executions/<timestamp>/videos/`
- **Format:** WebM
- **Recording:** Always enabled for all test scenarios

## 📸 Screenshots

Screenshots are automatically captured for all test scenarios (both passed and failed).

- **Location:** `test-results/executions/<timestamp>/screenshots/`
- **Format:** PNG
- **Capture:** Always enabled

## 🚀 Quick Execution

```bash
# Run tests and generate report automatically
npm test

# Generate report manually (without running tests)
npm run report:generate

# Open the report
open test-results/index.html
```

## 📊 HTML Report

### Location
The report is generated at: `test-results/index.html`

### Content
- ✅ All executed scenarios (Passed/Failed)
- 📝 Detailed Cucumber steps (Given/When/Then/And)
- ⏱️ Duration of each step and scenario
- 📊 Charts and statistics
- 📸 Failure screenshots
- 🏷️ Project metadata

**📸 Report Screenshots:**

![Execution History Main Page](../screenshots/execution-history-main.png.placeholder)
*Main execution history page with statistics and execution list*

![Execution Report Detail](../screenshots/execution-report-detail.png.placeholder)
*Detailed view of an individual execution report with Cucumber steps*

## 🎥 Videos

### Location
Videos are saved in: `test-results/videos/`

**📸 Video Integration:**

![Video Player in Report](../screenshots/report-video-collapse.png.placeholder)
*Video player embedded in the report - click "+ View Video" to expand*

### Example of Generated Videos
```
test-results/videos/
├── Scenario-name-0-0--CHROME--MM-DD-YYYY--HH-MM-SS-milliseconds.webm
├── Another-scenario-0-0--CHROME--MM-DD-YYYY--HH-MM-SS-milliseconds.webm
└── ...
```

### Format
- **Format**: WebM
- **Playback**: Modern browsers, VLC, QuickTime (with plugin)
- **Name**: `[Scenario]-[Worker]--[Browser]--[Date]--[Time].webm`

## 🔧 Technical Configuration

### wdio.conf.ts (Framework Configuration)
Configures video reporter:

```typescript
reporters: [
    'spec',
    [video, {
        saveAllVideos: true,
        videoSlowdownMultiplier: 1,
        videoRenderTimeout: 5,
        outputDir: `${executionDir}/videos/`,
        maxTestNameLength: 100
    }]
]

cucumberOpts: {
    format: ['json:test-results/cucumber-report.json']
}
```

### hooks.ts (Screenshot Logic)
Handles conditional screenshot capture:

```typescript
```

### generate-report.js
```javascript
report.generate({
  jsonDir: './test-results/',
  reportPath: './test-results/',
  jsonFile: 'cucumber-report.json',
  reportName: 'TodoMVC Test Report',
  // ... more configuration
});
```

## 🎯 How It Works

### Video Recording Flow

1. **Test Execution**:
   - `wdio-video-reporter` automatically records all test scenarios
   - Videos saved to: `test-results/executions/[timestamp]/videos/`

2. **Post-Processing** (`post-process-report.js`):
   - Scans for video files in the videos directory
   - Injects video players into HTML report
   - Creates collapsible sections for each video

### Screenshot Capture Flow

1. **Before Test** (`hooks.ts - Before`):
   - Records `startTime` for duration calculation
   - Navigates to clean application state

2. **After Test** (`hooks.ts - After`):
   - Calculates test duration
   - Takes screenshots for all test scenarios
   - Screenshots saved to: `test-results/executions/[timestamp]/screenshots/`
   - Attaches screenshot to Cucumber report (appears in HTML)

3. **Report Generation** (`generate-report.js`):
   - Screenshots embedded in HTML report automatically by Cucumber
   - Accessible in the "Show Info" collapse section

## ⚠️ Important: Isolation vs Videos

### Current Configuration (Full Videos)

**Location**: `src/support/hooks.ts` - Hook `After`

```typescript
// Clean state without closing browser
await browser.url('https://todomvc.com/examples/typescript-react/');
await browser.execute(() => localStorage.clear());
await browser.refresh();
```

**Advantages:**
- ✅ Videos are recorded for ALL scenarios
- ✅ Effective cleanup with localStorage.clear()
- ✅ Faster

**Disadvantages:**
- ⚠️ No complete browser session isolation

### Alternative Configuration (Complete Isolation)

```typescript
// Close and open browser between tests
await browser.reloadSession();
```

**Advantages:**
- ✅ Complete browser isolation
- ✅ Clean new session for each test

**Disadvantages:**
- ❌ Only the first scenario's video is recorded
- ❌ Video reporter loses context when browser closes

### When to Change?

If you need complete isolation (new browser per test):
1. Open `src/support/hooks.ts`
2. In the `After` hook, uncomment `reloadSession()` lines
3. Comment out state cleanup lines

⚠️ **Note**: With `reloadSession()` you'll only have 1 video instead of one per scenario.

## 📁 Results Structure

```
test-results/
├── cucumber-report.json           # JSON with results
├── index.html                     # Main HTML report
├── assets/                        # Report CSS/JS
│   ├── bootstrap.min.css
│   ├── cucumber-html.css
│   └── style.css
├── features/                      # Info per feature
│   └── todomvc.feature.html
└── videos/                        # Execution videos
    ├── [scenario-1].webm
    ├── [scenario-2].webm
    └── .video-reporter-screenshots/
```

**📸 Report Structure Visualization:**

![Statistics Dashboard](../screenshots/report-statistics-dashboard.png.placeholder)
*Dashboard with execution statistics (Total, Passed, Failed, Last Execution)*

![Execution Logs](../screenshots/report-logs-collapse.png.placeholder)
*Execution logs section showing browser console, page info, and debug data*

## 🔧 Troubleshooting

### Report is not generated

**Symptom**: `test-results/index.html` is not created

**Solution**:
```bash
# Verify JSON exists
ls -la test-results/cucumber-report.json

# Generate manually
npm run report:generate
```

### Videos are not recorded

**Symptom**: Empty `videos/` folder

**Possible causes**:
1. `wdio-video-reporter` not installed
2. Incorrect configuration in `wdio.conf.ts`
3. Using `reloadSession()` in hooks

**Solution**:
```bash
# Check installation
npm list wdio-video-reporter

# Reinstall if necessary
npm install --save-dev wdio-video-reporter
```

### Screenshots are not captured

**Symptom**: No screenshots in `screenshots/` folder

**Cause**: Check hooks.ts implementation

**Solution**: Verify screenshot capture logic in `src/support/hooks.ts`

### Only 1 video is recorded

**Symptom**: Only 1 video instead of multiple videos

**Cause**: You're using `reloadSession()` in the After hook

**Solution**: See "Current Configuration" section above

### Report doesn't show steps

**Symptom**: HTML doesn't show Given/When/Then

**Cause**: Missing JSON format configuration

**Solution**: Verify in `wdio.conf.ts`:
```typescript
cucumberOpts: {
    format: ['json:test-results/cucumber-report.json']
}
```

## 📝 Useful Commands

```bash
# Run tests
npm test

# Only generate report (without running tests)
npm run report:generate

# Open report
open test-results/index.html

# View generated videos
ls -lh test-results/videos/*.webm

# Count videos
ls test-results/videos/*.webm | wc -l

# Clean results
rm -rf test-results/

# Run and open report automatically
npm test && open test-results/index.html
```

## 🎯 Implementation Summary

### Installed Packages
- `wdio-video-reporter`: Video recording
- `multiple-cucumber-html-reporter`: HTML report generation

### Key Files
1. **wdio.conf.ts**: Framework configuration and reporter setup
2. **generate-report.js**: HTML report generation
3. **src/support/hooks.ts**: Test lifecycle and screenshot capture logic
4. **package.json**: Test execution and report scripts

### Features
- ✅ HTML report with Cucumber steps
- ✅ **Configurable video recording**: always, onFailure, or never
- ✅ **Configurable screenshots**: always, onFailure, or never
- ✅ Execution logs (separate collapse)
- ✅ Video player (separate collapse)
- ✅ Execution history with timestamps
- ✅ Duration tracking
- ✅ Statistics dashboard
- ✅ Delete execution functionality
- ✅ HTTP server for report viewing
- ✅ Browser state cleanup between tests
