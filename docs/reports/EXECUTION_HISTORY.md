# Execution History System

## 📋 Description

The framework now maintains a complete history of all test executions. Each execution is saved in an independent folder with a timestamp, preserving:

- ✅ HTML Reports
- 🎥 Execution Videos
- 📸 Failure Screenshots
- 📊 Logs in JSON format
- 📝 Detailed information for each test
- 🌐 Browser metadata (name and version)
- 🏷️ Feature tags display

## 📁 File Structure

```
test-results/
├── index.html                          # Main page with history
└── executions/
    ├── 2026-02-16_14-30-45/           # Execution 1
    │   ├── index.html                  # Report for this execution
    │   ├── cucumber-report.json        # JSON data
    │   ├── videos/                     # Test videos
    │   ├── screenshots/                # Failure screenshots
    │   └── features/                   # Feature HTML files
    ├── 2026-02-16_15-45-20/           # Execution 2
    │   ├── index.html
    │   ├── cucumber-report.json
    │   ├── videos/
    │   ├── screenshots/
    │   └── features/
    └── ...
```

## 🎯 Features

### Main Page (index.html)
- **Complete listing** of all executions
- **General statistics**: Total executions, successful, failed
- **Detailed information** per execution:
  - Date and time
  - Features executed
  - Scenarios (passed/failed/total)
  - Steps (passed/failed/total)
  - Total duration
  - Status (PASSED/FAILED)
  - Direct link to report

**📸 Main Page Preview:**

![Execution History Main Page](../screenshots/execution-history-main.png.placeholder)
*Main execution history page showing all test runs with statistics and status*

![Statistics Dashboard](../screenshots/report-statistics-dashboard.png.placeholder)
*Dashboard with execution statistics: Total, Passed, Failed, and Last Execution*

### Individual Reports
Each execution has its own report with:
- Detailed Cucumber steps
- Videos for each test (separate collapse)
- Execution logs (separate collapse)
- Failure screenshots
- Real duration information
- **Browser version** (e.g., Chrome 145.0.7632.76, Firefox 147.0.4)
- **Tags** displayed in scenario headers

**📸 Individual Report Preview:**

![Execution Report Detail](../screenshots/execution-report-detail.png.placeholder)
*Detailed view of an individual execution report with Cucumber steps and results*

![Report Video Collapse](../screenshots/report-video-collapse.png.placeholder)
*Video player section showing recorded test execution*

![Report Logs Collapse](../screenshots/report-logs-collapse.png.placeholder)
*Execution logs section with browser console, page info, and debug data*

## 🚀 Usage

### Run Tests and Generate History

```bash
# Run all tests (default: Chrome)
npm run test:all

# Run only @smoke tests
npm run test:smoke

# Run in specific browser
BROWSER=firefox npm test
BROWSER=safari npm test

# Run in multiple browsers
BROWSER=chrome,firefox npm test

# Run with specific tags
npm run test:tags -- --cucumberOpts.tagExpression="@locked"

# View complete history
npm run test:report
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests and generate report |
| `npm run test:smoke` | Run only tests with @smoke tag |
| `npm run test:tags` | Run tests with specific tag expression |
| `npm run test:all` | Run tests, generate report and open it |
| `npm run test:report` | Open execution history |
| `npm run report:generate` | Generate report from last execution |
| `npm run clean` | Clean old executions |
| `npm run clean:all` | Clean entire test-results |

### Multi-Browser Execution

| Browser | Command |
|---------|--------|
| Chrome (default) | `npm test` |
| Firefox | `BROWSER=firefox npm test` |
| Safari (macOS) | `BROWSER=safari npm test` |
| Multiple | `BROWSER=chrome,firefox npm test` |

## 🔧 Internal Workflow

### 1. Execution Start
- A unique timestamp is generated (YYYY-MM-DD_HH-MM-SS)
- `test-results/executions/[timestamp]/` folder is created
- Videos and screenshots are saved in this folder

### 2. During Tests
- Videos are recorded in `[timestamp]/videos/`
- Screenshots are saved in `[timestamp]/screenshots/`
- **Per-worker JSON files**: Each spec writes `cucumber-report-{specName}.json`
- Browser metadata saved to `.browser-metadata`

### 3. JSON Merge (onComplete)
- All per-worker JSON files are merged into `cucumber-report.json`
- Ensures all features appear in reports (fixes multi-worker overwrite)

### 4. Report Generation
- HTML report is generated in `[timestamp]/index.html`
- Videos are processed and injected per scenario/example
- Tags are displayed in scenario headers
- Browser version is shown (e.g., "Chrome 145.0.7632.76")
- Main index is generated with complete history

### 5. Cleanup
- The temporary `.execution-timestamp` file is deleted automatically
- Per-worker JSON files are cleaned after merge
- `.browser-metadata` is used then cleaned
- Historical reports are maintained until manual cleanup

## 📊 Advantages

✅ **Complete history**: All executions are preserved
✅ **Traceability**: You can see exactly what happened in each execution
✅ **Comparison**: Compare results between different executions
✅ **Evidence**: Videos and screenshots always available
✅ **No overwrite**: Each execution is independent
✅ **Organized**: Clear structure by date and time
✅ **Multi-browser**: Support for Chrome, Firefox, Safari
✅ **Accurate metadata**: Real browser name and version displayed
✅ **Multi-worker safe**: Per-spec JSON prevents data loss

## 🧹 History Cleanup

The execution history is **read-only** from the web interface. Use NPM scripts or the interactive cleanup menu to manage disk space.

### Interactive Cleanup Menu
```bash
npm run clean:interactive
```
This opens an interactive menu with options to:
1. Delete only videos (keep reports and screenshots)
2. Delete videos and screenshots (keep reports)
3. Delete all executions (keep main index)
4. Delete everything (complete cleanup)
5. Cancel

### Clean all executions
```bash
npm run clean
```
This removes all executions but keeps the main index structure.

### Clean everything
```bash
npm run clean:all
```
Completely removes the test-results folder.

## 📝 Notes

- The timestamp uses 24-hour format: YYYY-MM-DD_HH-MM-SS
- Executions are listed from most recent to oldest
- The main report is automatically updated after each execution
- Videos are kept in the same folder as the report for direct access
