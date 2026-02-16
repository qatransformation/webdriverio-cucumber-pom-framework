# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-16

### Added
- **Multi-browser execution support** via BROWSER environment variable
  - Chrome (default), Firefox, Safari (macOS)
  - Run in multiple browsers: `BROWSER=chrome,firefox npm test`
  - Example: `BROWSER=safari npm test`
- **Browser metadata in reports** - displays actual browser name and version
  - Shows "Chrome 145.0.7632.76" instead of "latest"
  - Browser metadata saved to `.browser-metadata` file
- **Per-worker JSON generation** for multi-spec parallel execution
  - Each spec writes `cucumber-report-{specName}.json`
  - `onComplete` hook merges all JSON files
  - Fixes data loss when running multiple features in parallel
- **Feature tags display** in scenario headers
  - Tags visible in HTML report scenario titles
- **SauceDemo feature** with login tests
  - `features/saucedemo.feature` with @locked user scenario
  - `src/pages/SauceDemoPage.ts` Page Object
  - `src/steps/saucedemo.steps.ts` step definitions

### Changed
- **Documentation reorganization**
  - Moved `SAUCEDEMO_FEATURE.md` to `docs/guides/`
  - Moved `show-structure.sh` to `docs/`
  - Updated all references in README, architecture docs
- **PROJECT_SUMMARY.md** updated with current architecture
- **EXECUTION_HISTORY.md** updated with multi-browser workflow
- **Capabilities** now dynamically generated from BROWSER env var

### Fixed
- **Multi-worker JSON overwrite** - all features now appear in reports
- **Browser version display** - uses `browser.capabilities.browserVersion`
- **Scenario Outline formatting** - proper example parameter display

---

## [1.1.0] - 2026-02-16

### Added
- **Automatic report server startup** with browser opening
  - New script `scripts/open-report-server.js`
  - Detects if server is already running
  - Starts server in background if needed
  - Automatically opens browser to http://localhost:8080
  - Cross-platform support (macOS, Windows, Linux)
- **Enhanced NPM scripts** with automatic workflow
  - `test:open` - Run tests, generate reports, open in browser
  - `test:smoke:open` - Run smoke tests with auto-open
  - `test:tag:open` - Run tagged tests with auto-open
  - `serve:open` - Start server and open browser

### Changed
- **Video embedding optimized** - videos only in feature detail pages
  - Videos embedded in individual feature HTML files
  - NOT embedded in execution index.html (faster loading)
  - Access via "+View Video" links in feature pages
- **Improved report performance** - execution index loads instantly
- **Better UX** - videos where they matter most (feature details)
- **Updated documentation** to reflect all new features and optimizations

### Fixed
- **Report generation robustness** - now works even when tests exit with non-zero code
  - Removed posttest hook (doesn't run on test "failure")
  - Added explicit `npm run report:generate` to all :open scripts
  - Guarantees index.html creation before server startup
  - Fixes 404 error when accessing localhost:8080
  - Workflow now robust against WebdriverIO exit code bug

### Technical Details
- Modified `src/reports/post-process-report.js` - removed index.html video injection
- Created `scripts/open-report-server.js` - automatic server management
- Updated package.json scripts - explicit report generation
- Videos location: `test-results/executions/<timestamp>/videos/`
- Videos embedded in: `test-results/executions/<timestamp>/features/*.html`
- Videos NOT in: `test-results/executions/<timestamp>/index.html`
- Format: WebM with collapsible "+View Video" sections
- Server: HTTP on port 8080, serves test-results/

## [1.0.0] - 2026-02-16

### 🎉 Initial Release

First stable release of the WebdriverIO + Cucumber + Page Object Model automation framework.

### ✨ Features

#### 🧪 Test Execution
- **WebdriverIO v9.24.0** integration with Cucumber framework
- **Page Object Model (POM)** architecture for maintainable test code
- **Multiple browser support**: Chrome (default), Firefox, Edge, Safari
- **Headless mode** by default with option for headed execution
- **Tag-based test execution** with Cucumber tags (@smoke, @regression, etc.)
- **Automatic test isolation** with clean browser state between scenarios

#### 📹 Evidence Recording
- **Video recording** enabled for all test executions (always on)
  - Format: WebM
  - Location: `test-results/executions/<timestamp>/videos/`
  - **Not embedded** in HTML reports (manual access only)
- **Screenshot capture** for all scenarios (passed and failed)
  - Format: PNG
  - Location: `test-results/executions/<timestamp>/screenshots/`
  - Attached to Cucumber reports

#### 📊 Reporting
- **Enhanced HTML reports** with multiple-cucumber-html-reporter
- **Execution history** with main index page
  - View all past executions
  - Statistics: Total, Passed, Failed scenarios
  - Date/time of each execution
  - Quick access to individual reports
- **Detailed scenario reports** including:
  - Step-by-step execution details
  - Embedded screenshots
  - Feature file paths and scenario names
  - Browser console logs on failures
  - Error messages and stack traces
  - Execution duration per step
- **Fast loading** - videos not embedded for better performance
- **No-cache headers** for fresh content on reload

#### 🗂️ Execution Management
- **Timestamped executions** (YYYY-MM-DD_HH-MM-SS format)
- **Organized directory structure**:
  ```
  test-results/
  ├── index.html (main history)
  └── executions/
      ├── 2026-02-16_17-08-45/
      │   ├── index.html
      │   ├── cucumber-report.json
      │   ├── videos/
      │   └── screenshots/
      └── 2026-02-16_16-58-20/
          └── ...
  ```
- **Automatic post-processing** of reports after test execution

#### 🧹 Cleanup Utilities
- **Interactive cleanup menu** (`npm run clean:interactive`) with 5 options:
  1. Delete only videos (keep reports and screenshots)
  2. Delete videos and screenshots (keep reports)
  3. Delete all executions (keep main index)
  4. Delete everything (complete cleanup)
  5. Cancel
- **Storage calculation** showing disk space used
- **Manual cleanup commands**:
  - `npm run clean`: Remove executions and main index
  - `npm run clean:all`: Remove entire test-results directory

#### 🚀 NPM Scripts
- `npm test`: Run all tests with automatic report generation
- `npm run test:open`: Run all tests and open report in browser
- `npm run test:smoke`: Run only @smoke tagged tests
- `npm run test:smoke:open`: Run @smoke tests and open report
- `npm run test:tag -- '@tag'`: Run tests with specific tag
- `npm run test:tag:open -- '@tag'`: Run tests with tag and open report
- `npm run test:headed`: Run tests with visible browser
- `npm run test:firefox`: Run tests in Firefox browser
- `npm run test:report`: Open the main report index
- `npm run report:generate`: Manually generate report from existing results
- `npm run serve:report`: Start HTTP server on port 8080 and serve reports
- `npm run clean`: Clean execution results
- `npm run clean:all`: Clean all test results
- `npm run clean:interactive`: Launch interactive cleanup menu

#### 🔧 Technical Features
- **TypeScript support** with ts-node
- **JSON reporter** for Cucumber integration
- **Custom hooks** for test lifecycle management:
  - Before: Clean state initialization
  - After: Evidence capture and browser cleanup
- **Comprehensive error handling** with detailed failure information
- **Browser console log capture** on test failures
- **Page information capture** (URL, title, HTML size)
- **Execution duration tracking** per scenario and step
- **Automatic browser state cleanup** between scenarios
- **HTTP server** for proper video playback (CORS-free)

#### 🎯 TodoMVC Test Suite
- Complete test suite for TodoMVC React TypeScript implementation
- CRUD operations testing (Create, Read, Update, Delete)
- Counter validation
- Filter testing (All, Active, Completed)
- Clear completed functionality
- Multiple task management
- Edge cases and validation

### 📦 Dependencies
- @wdio/cli: ^9.24.0
- @wdio/cucumber-framework: ^9.24.0
- @wdio/local-runner: ^9.24.0
- @wdio/json-reporter: ^9.20.0
- @cucumber/cucumber: ^12.6.0
- webdriverio: ^9.24.0
- wdio-video-reporter: ^6.2.0
- multiple-cucumber-html-reporter: ^3.10.0
- typescript: via ts-node ^10.9.2

### 📝 Documentation
- README.md with complete usage guide
- ARCHITECTURE.md with system design
- REPORTS_WITH_VIDEOS.md for video recording details
- VIDEO_RECORDING.md for video configuration
- EXECUTION_HISTORY.md for execution management
- QUICK_REFERENCE.md for command reference
- TODOMVC_QUICK_REF.md for TodoMVC testing guide
- USAGE_GUIDE.md for framework usage
- VALIDATION.md for testing approach
- ENVIRONMENT_SETUP_SUMMARY.md for setup instructions
- PIPELINE_CONFIGURATION.md for CI/CD integration

### 🔒 Security
- Directory traversal protection in report server
- No sensitive data in reports
- Clean error messages without internal paths exposure

### 🎨 User Experience
- Color-coded console output with emojis
- Progress indicators during execution
- Clear success/failure messages
- Automatic browser launch for reports
- Graceful shutdown handling

### 🏗️ Architecture
- Page Object Model (POM) pattern
- Separation of concerns (pages, steps, support, utils)
- Reusable base page class
- Custom World for test context
- Centralized configuration
- Modular hooks system

---

## Future Considerations

Potential features for future releases:
- Parallel execution support
- Multiple browser concurrent testing
- API testing integration
- Visual regression testing
- Performance metrics
- Test data management
- Retry mechanism for flaky tests
- Slack/Email notifications
- Cloud execution (BrowserStack, Sauce Labs)
- Allure report integration

---

**Note**: This version has all evidence recording (videos and screenshots) enabled by default for comprehensive test documentation.
