# � Automation Framework: WebdriverIO + Cucumber + Page Object Model

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WebdriverIO](https://img.shields.io/badge/WebdriverIO-EA5906?style=for-the-badge&logo=webdriverio&logoColor=white)](https://webdriver.io/)
[![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=for-the-badge&logo=cucumber&logoColor=white)](https://cucumber.io/)

This project implements a complete and professional UI test automation framework using:
- **🌐 WebdriverIO** - Next-gen browser and mobile automation test framework
- **🥒 Cucumber** - BDD (Behavior Driven Development) with Gherkin
- **📄 Page Object Model** - Design pattern for maintainable and scalable code
- **📘 TypeScript** - Strong typing for greater robustness

## 🏗️ Architecture

```
webdriverio_cucumber_pom/
├── src/
│   ├── pages/              # Page Objects
│   │   ├── BasePage.ts     # Base class for all pages
│   │   ├── TodoPage.ts     # Page Object for TodoMVC
│   │   └── index.ts        # Exports
│   ├── steps/              # Cucumber Step Definitions
│   │   ├── todo.steps.ts   # Steps for TodoMVC
│   │   └── common.steps.ts # Reusable steps
│   └── support/            # Configuration and utilities
│       ├── world.ts        # Cucumber Custom World
│       └── hooks.ts        # Hooks (Before/After)
├── features/               # Feature files (Gherkin)
│   └── todomvc.feature     # ✨ TodoMVC tests (11 scenarios)
├── test-results/          # Reports, screenshots and videos
├── wdio.conf.ts          # WebdriverIO configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## 📦 Installation

```bash
# Install dependencies
npm install

# WebdriverIO will automatically download browser drivers
```

## 🚀 Running Tests

### Basic Execution

```bash
# Run all tests (Chrome by default)
npm test

# Run only tests with @smoke tag
npm run test:smoke

# Run tests in headed mode (see browser)
npm run test:headed

# View results report (with embedded videos)
npm run test:report
```

### Cleanup and Storage Management

Manage test results and free disk space with the interactive cleanup utility:

```bash
# Launch interactive cleanup menu (RECOMMENDED)
npm run clean:interactive
```

**Available cleanup options:**
1. Clean execution history (keep folder structure)
2. Clean ALL test results (complete reset)
3. Clean videos only (free 80-90% of storage)
4. Clean screenshots only
5. Keep last N executions (rolling history)

**Quick cleanup commands:**
```bash
# Remove execution history
npm run clean

# Remove everything
npm run clean:all
```

See **[CLEANUP_GUIDE.md](./CLEANUP_GUIDE.md)** for detailed cleanup strategies and examples.

### Browser Configuration

WebdriverIO manages browser configuration through `wdio.conf.ts`:

```bash
# Run in headed mode (show browser)
HEADLESS=false npm test

# Run in Firefox
npm run test:firefox

# Default: Chrome headless
npm test
```

**Available browsers:** `chrome` (default), `firefox`, `edge`, `safari`  
**Configuration file:** `wdio.conf.ts`

See **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** for complete CI/CD pipeline configuration.
}
```

See **[REPORTS_WITH_VIDEOS.md](./REPORTS_WITH_VIDEOS.md)** for complete configuration details.

## 📊 Reports and Videos

### 🎯 How the Report System Works

The framework generates **enhanced HTML reports** with comprehensive debugging information and maintains a **complete execution history**:

#### Execution History Structure

Each test execution is saved in a separate folder with timestamp:

```
test-results/
├── index.html                          # 📊 Main page with execution history
└── executions/
    ├── 2026-02-16_14-30-45/           # First execution
    │   ├── index.html                  # Detailed report
    │   ├── cucumber-report.json        # Raw test data
    │   ├── videos/                     # Video recordings
    │   │   └── *.webm files
    │   ├── screenshots/                # Failure screenshots
    │   │   └── *.png files
    │   └── features/                   # Feature HTML reports
    ├── 2026-02-16_15-45-20/           # Second execution
    │   └── ... (same structure)
    └── ... (more executions)
```

#### 📋 Main Index Features

The main `test-results/index.html` provides:
- **Complete history** of all test executions
- **Statistics dashboard**: Total, passed, failed executions
- **Detailed information** per execution:
  - Date and time
  - Features executed
  - Scenarios (passed/failed/total)
  - Steps (passed/failed/total)
  - Total duration
  - Status (PASSED/FAILED)
  - Direct link to detailed report

**📸 Main Execution History Page:**

![Execution History](docs/screenshots/execution-history-main.png)
*View of the main dashboard with execution history, statistics, and delete functionality*

![Statistics Dashboard](docs/screenshots/report-statistics-dashboard.png)
*Statistics cards showing execution metrics*

#### 🎥 Individual Execution Reports

Each execution report includes:
- **Cucumber steps** with pass/fail status
- **Two separate collapsible sections**:
  - 📝 **+ Show Info**: Execution logs, browser console, page info
  - 🎥 **+ View Video**: Video recording of the test
- **Screenshots** for failed tests
- **Real execution duration** (calculated automatically)
- **Comprehensive debug information**

**📸 Detailed Execution Report:**

![Execution Report Detail](docs/screenshots/execution-report-detail.png)
*Individual execution report showing scenarios and steps*

**📸 Collapsible Sections:**

![Execution Logs](docs/screenshots/report-logs-collapse.png)
*Execution logs section with browser console and debug information*

![Video Player](docs/screenshots/report-video-collapse.png)
*Video recording embedded in the report*

### 🚀 Viewing Reports

#### Option 1: Using Report Server (RECOMMENDED)

Start the report server to view reports with delete functionality:

```bash
npm run serve:report
```

This will:
- ✅ Start a server at `http://localhost:8080`
- ✅ Auto-open your browser
- ✅ Allow you to delete executions
- ✅ View all reports with proper MIME types

**Features available with server:**
- View all execution reports
- Delete executions (videos, screenshots, logs)
- Real-time updates after deletion
- Proper video playback

#### Option 2: Direct File Access (Limited)

Open the HTML file directly:

```bash
npm run test:report
```

**Limitations:**
- ❌ Cannot delete executions
- ⚠️ Video playback may not work in all browsers
- Static view only

### 🗑️ Deleting Execution Reports

#### Using the Report Server UI

1. **Start the report server:**
   ```bash
   npm run serve:report
   ```

2. **Click the "🗑️ Delete" button** next to any execution

3. **Confirm deletion** - A warning will show what will be deleted:
   - HTML reports
   - Videos (.webm files)
   - Screenshots (.png files)
   - Logs (JSON data)

4. **Wait for confirmation** - The page will reload automatically

**📸 Delete Functionality:**

![Delete Confirmation](docs/screenshots/delete-button-confirmation.png)
*Confirmation dialog before deleting an execution*

#### Using Command Line

**Delete all executions (keep structure):**
```bash
npm run clean
```
Removes: `test-results/executions/` and `test-results/index.html`

**Delete everything (complete cleanup):**
```bash
npm run clean:all
```
Removes: Entire `test-results/` folder

### ⚙️ Running Tests and Generating Reports

```bash
# Run all tests + generate report + open in browser
npm run test:all

# Run only tests (report generated automatically)
npm test

# Run smoke tests only
npm run test:smoke

# Generate report from existing test results
npm run report:generate

# View report in browser
npm run test:report

# Start report server with delete functionality
npm run serve:report
```

### 📊 Report Details

**✨ Enhanced Report Features:**
- 🎥 **Videos embedded**: Two separate collapses for logs and video
- 📋 **Execution logs**: Complete logs for all tests (passed and failed)
- 🐛 **Debug information**: Browser console logs, page info, error messages
- 📸 **Auto screenshots**: Captured on test failures
- ⏱️ **Real duration**: Calculated from actual execution time
- 💡 **Troubleshooting tips**: Guided debugging information
- 📊 **Statistics**: Duration, pass/fail rates, timestamps
- 🌐 **Environment info**: Platform, browser, Node version
- 🗂️ **Execution history**: All past executions preserved

**Report Locations:**
- Main History: `test-results/index.html` ← **Open with server**
- Execution Report: `test-results/executions/[timestamp]/index.html`
- Videos: `test-results/executions/[timestamp]/videos/`
- Screenshots: `test-results/executions/[timestamp]/screenshots/`
- JSON Data: `test-results/executions/[timestamp]/cucumber-report.json`

📖 **Full documentation**: 
- [EXECUTION_HISTORY.md](./EXECUTION_HISTORY.md) - Complete guide to execution history
- [REPORTS_WITH_VIDEOS.md](./REPORTS_WITH_VIDEOS.md) - Video report details

### 🔒 Security Notes

When using the report server:
- ✅ Confirmation required before deletion
- ✅ No accidental deletions
- ✅ Directory traversal protection
- ✅ Only serves files from test-results/
- ✅ Clear error messages

## 📝 Writing Tests

### 1. Create a Feature File

Create a `.feature` file in the `features/` folder:

```gherkin
# language: en
Feature: User Login
  As a user
  I want to be able to log in
  To access my account

  Scenario: Successful login
    Given the user navigates to the login page
    When they enter valid credentials
    Then they should see the dashboard
```

### 2. Create a Page Object

Create a class in `src/pages/`:

```typescript
import { BasePage } from './BasePage';
import { browser } from '@wdio/globals';

export class LoginPage extends BasePage {
  private readonly selectors = {
    emailInput: '#email',
    passwordInput: '#password',
    loginButton: 'button[type="submit"]',
  };

  constructor() {
    super('https://your-site.com');
  }

  async login(email: string, password: string) {
    await this.fill(this.selectors.emailInput, email);
    await this.fill(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }
}
```

### 3. Create Step Definitions

Create a file in `src/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { browser, expect } from '@wdio/globals';
import { CustomWorld } from '../support/world';

Given('the user navigates to the login page', async function (this: CustomWorld) {
  await this.loginPage.navigate('/login');
});

When('they enter valid credentials', async function (this: CustomWorld) {
  await this.loginPage.login('user@example.com', 'password123');
});

Then('they should see the dashboard', async function (this: CustomWorld) {
  const url = await browser.getUrl();
  expect(url).toContain('/dashboard');
});
```

## 🎯 Patterns and Best Practices

### Page Object Model
- Each page has its own class that inherits from `BasePage`
- Selectors are defined as private properties
- Methods represent actions a user can perform
- Do not include assertions in Page Objects

### Step Definitions
- Keep steps simple and reusable
- Use Page Objects to interact with UI
- Assertions go in steps, not in Page Objects
- Use `CustomWorld` to share context between steps

### Features (Gherkin)
- Write scenarios from the user's perspective
- Use business language, not technical
- Keep scenarios independent of each other
- Use tags (@smoke, @regression) to organize tests

## 🔧 Configuration

### Browser Configuration

The framework includes specific configurations to optimize the testing experience:

#### Chrome/Chromium
- **Automatic translation disabled**: Google Translate popup is completely disabled
- **Language configured**: `en-US` for test consistency
- **CDP (Chrome DevTools Protocol)**: Advanced preference configuration

**Applied configurations:**
```typescript
// Chrome arguments
--disable-features=Translate
--disable-translate
--disable-blink-features=AutomationControlled

// Context preferences
locale: 'en-US'
extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
```

See [src/support/world.ts](src/support/world.ts) for implementation details.

## ⚙️ Environment Setup

### Configuration File (`test.config.json`)

The framework uses `wdio.conf.ts` to define the base URL and browser capabilities:

```typescript
export const config: Options.Testrunner = {
  baseUrl: 'https://todomvc.com/examples/typescript-react/',
  
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: process.env.HEADLESS === 'true' 
        ? ['--headless', '--disable-gpu']
        : []
    }
  }],
  
  // Environment-specific configuration can be handled via environment variables
  // Example:
  // baseUrl: process.env.BASE_URL || 'https://todomvc.com/examples/typescript-react/',
};
```

For multiple environments, you can use environment variables:

```json
// package.json
{
  "scripts": {
    "test:dev": "BASE_URL=https://dev.example.com wdio run wdio.conf.ts",
    "test:staging": "BASE_URL=https://staging.example.com wdio run wdio.conf.ts",
    "test:prod": "BASE_URL=https://production.example.com wdio run wdio.conf.ts"
  }
}
    "firefox": {
      "channel": null,
      "headless": true,
      "viewport": { "width": 1280, "height": 720 }
    }
  },
  "default": {
    "environment": "dev",
    "browser": "chrome"
  }
}
```

### Using the Configuration File

#### **Default Values**
Without specifying variables, the framework uses:
- **Environment:** `dev` (defined in `default.environment`)
- **Browser:** `chrome` (defined in `default.browser`)

```bash
npm test  # Uses dev + chrome automatically
```

#### **Parameterization with Environment Variables**

| Variable | Values | Default | Description |
|----------|---------|---------|-------------|
| `TEST_ENV` | local, dev, staging, production | dev | Environment where tests run |
| `BROWSER` | chrome, firefox, safari, edge | chrome | Browser to use |
| `HEADLESS` | true, false | true | Run without graphical interface |
| `RECORD_VIDEO` | true, false | false | Record test videos |

#### **Usage Examples**

```bash
# Specify environment
TEST_ENV=staging npm test

# Specify browser
BROWSER=firefox npm test

# Headed mode (show browser)
HEADLESS=false npm test

# Video recording
RECORD_VIDEO=true npm test

# Combinations
TEST_ENV=production BROWSER=chrome HEADLESS=false npm test

# Parallel tests with video on staging
TEST_ENV=staging RECORD_VIDEO=true npm run test:parallel:video
```

#### **How Parameterization Works**

1. The framework reads `test.config.json` on startup
2. Looks for the `TEST_ENV` environment variable or uses the default
3. Loads the corresponding configuration (baseUrl, timeout, slowMo)
4. Looks for the `BROWSER` environment variable or uses the default
5. Applies the browser configuration (headless, viewport, channel)

**Practical example:**
```bash
TEST_ENV=staging BROWSER=firefox npm test
```

↓ The framework loads:
- **baseUrl:** `https://staging.example.com`
- **timeout:** `45000ms`
- **browser:** Firefox
- **viewport:** 1280x720

#### **Adding New Environments**

Edit `test.config.json`:
```json
{
  "environments": {
    "qa": {
      "name": "qa",
      "baseUrl": "https://qa.myapp.com",
      "timeout": 35000,
      "slowMo": 0
    }
  }
}
```

Use:
```bash
TEST_ENV=qa npm test
```

#### **Adding New Browsers**

Edit `test.config.json`:
```json
{
  "browsers": {
    "chromium-mobile": {
      "channel": null,
      "headless": true,
      "viewport": { "width": 375, "height": 667 }
    }
  }
}
```

Use:
```bash
BROWSER=chromium-mobile npm test
```

### For CI/CD Pipelines

The framework includes complete CI/CD pipeline configurations:

**Jenkins Pipeline** (Jenkinsfile)
```groovy
# The repository includes a complete Jenkinsfile with:
# - Video recording enabled
# - Automatic report generation
# - Artifact archiving (videos, screenshots, reports)
# - Parameterized execution
```

**GitHub Actions** (.github/workflows/e2e-tests.yml)
```yaml
# GitHub Actions example
- name: Run tests on staging with Firefox
  run: TEST_ENV=staging BROWSER=firefox npm test
```

**GitLab CI / Jenkins / Azure DevOps**
```bash
# Generic command for any CI/CD platform
TEST_ENV=production BROWSER=chrome RECORD_VIDEO=true npm test
```

See **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** for:
- ✅ Complete Jenkinsfile documentation with video recording
- ✅ GitHub Actions matrix strategies
- ✅ GitLab CI, Jenkins, and Azure DevOps examples
- ✅ Environment variable configuration
- ✅ Artifact publishing and report generation

### Custom Fixtures (Environment Configuration)

The framework includes a **custom fixtures** system to configure the testing environment:

```typescript
// Access fixture in any step
Given('my step', function (this: CustomWorld) {
  // Get environment configuration
  const env = this.fixture.getEnvironment();
  console.log(env.baseUrl);  // https://todomvc.com/examples/typescript-react/
  
  // Get test users
  const admin = this.fixture.getUser('admin');
  
  // Get test data
  const todos = this.fixture.getTodos('sample');
});
```

### WebdriverIO (`wdio.conf.ts`)
- Browsers to use
- Timeouts
- Screenshot configuration
- Base URL
- Cucumber options
- Auto-compilation for TypeScript

### TypeScript (`tsconfig.json`)
- Compiler configuration
- Module resolution
- Included types

## 📊 Reports

Reports are generated in `test-results/`:
- `cucumber-report.html` - Visual HTML report
- `cucumber-report.json` - JSON format report
- `screenshots/` - Failure screenshots
- `videos/` - Execution videos (if enabled)

## 🛠️ Utilities

### Available Hooks
- `Before` - Runs before each scenario
- `After` - Runs after each scenario (captures screenshots on failures)
- `BeforeAll` - Runs once at the beginning
- `AfterAll` - Runs once at the end

### Custom World
The `CustomWorld` provides:
- Browser instance
- Current page
- All initialized Page Objects
- **Fixture Manager** for environment configuration
- Setup and cleanup methods

## 🎯 Meaningful Assertions

All validations using `expect()` include **descriptive messages** to improve report comprehension:

```typescript
// Instead of:
expect(actualCount).toBe(expectedCount);

// Now with meaningful context:
expect(
  actualCount, 
  `Expected to see ${expectedCount} tasks in the list but found ${actualCount}`
).toBe(expectedCount);
```

**Benefits:**
- ✅ Clear and contextual error messages
- ✅ Faster debugging
- ✅ More understandable reports
- ✅ Better failure communication to the team

**Error message example:**
```
Error: Expected to see 5 tasks in the list but found 3
Expected: 5
Received: 3
```

## 📚 Recursos

- **[README.md](./README.md)** - 👋 Project start and overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 🏗️ Detailed architecture and patterns
- **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** - ⚙️ Environment configuration and CI/CD pipelines
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - 📖 Complete guide with examples
- **[VIDEO_RECORDING.md](./VIDEO_RECORDING.md)** - 🎥 Video recording guide
- **[REPORTS_WITH_VIDEOS.md](./REPORTS_WITH_VIDEOS.md)** - 📊 Reports with embedded videos
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - ⚡ Essential commands
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 📋 Project summary
- [WebdriverIO Docs](https://webdriver.io/)
- [Cucumber Docs](https://cucumber.io/docs/cucumber/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a new branch for your feature
2. Follow the established patterns
3. Write tests for your code
4. Commit with descriptive messages
5. Create a Pull Request

## ⚡ Test Parallelization Configuration

### Parallel Execution with Cucumber + WebdriverIO

This framework supports multiple parallelization strategies to optimize execution time.

### 🌐 Parallelization by Browsers

#### Configuration in `cucumber.js`

**File to modify:** `cucumber.js`

```javascript
module.exports = {
  default: {
    parallel: 3, // 3 workers in parallel
    format: ['progress-bar', 'json:test-results/cucumber-report.json']
  }
};
```

#### Usage with environment variables
```bash
# Run same suite on different browsers (requires separate scripts)
npm run test:chrome & npm run test:firefox & npm run test:safari
```

#### CI/CD Pipeline - Browser matrix

**File to create:** `.github/workflows/tests.yml`

```yaml
# GitHub Actions
strategy:
  matrix:
    browser: [chrome, firefox, edge]
steps:
  - run: BROWSER=${{ matrix.browser }} npm test
```

**Scripts in package.json:**
```json
{
  "scripts": {
    "test:chrome": "BROWSER=chrome npm test",
    "test:firefox": "BROWSER=firefox npm test",
    "test:safari": "BROWSER=safari npm test",
    "test:all-browsers": "npm run test:chrome && npm run test:firefox && npm run test:safari"
  }
}
```

---

### 🏷️ Parallelization by Tags

#### Configuration in `cucumber.js`

**File to modify:** `cucumber.js`

```javascript
module.exports = {
  smoke: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 2,
    tags: '@smoke'
  },
  regression: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 4,
    tags: '@regression and not @slow'
  },
  critical: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 2,
    tags: '@critical'
  }
};
```

#### Usage
```bash
# Run only smoke tests in parallel
npm test -- --profile smoke

# Run regression tests in parallel
npm test -- --profile regression

# Run multiple profiles simultaneously
npm test -- --profile smoke & npm test -- --profile regression
```

#### CI/CD Pipeline - Tag matrix

**File to create:** `.github/workflows/tests-by-tags.yml`

```yaml
# GitHub Actions
strategy:
  matrix:
    tag: [smoke, regression, critical]
steps:
  - run: npm test -- --tags @${{ matrix.tag }} --parallel 2
```

**File to modify:** `package.json`

```json
{
  "scripts": {
    "test:smoke": "cucumber-js --tags @smoke --parallel 2",
    "test:regression": "cucumber-js --tags @regression --parallel 4",
    "test:critical": "cucumber-js --tags @critical --parallel 2"
  }
}
```

---

### 📁 Parallelization by Folders/Features

#### Run specific features in parallel
```bash
# Run features from different folders in parallel
cucumber-js features/authentication/ --parallel 2 &
cucumber-js features/dashboard/ --parallel 2 &
cucumber-js features/checkout/ --parallel 2 &
wait
```

#### Advanced configuration by folder

**File to modify:** `cucumber.js`

```javascript
module.exports = {
  auth: {
    paths: ['features/authentication/**/*.feature'],
    parallel: 2
  },
  dashboard: {
    paths: ['features/dashboard/**/*.feature'],
    parallel: 3
  },
  checkout: {
    paths: ['features/checkout/**/*.feature'],
    parallel: 2
  }
};
```

#### CI/CD Pipeline - Folder matrix

**File to create:** `.github/workflows/tests-by-folder.yml`

```yaml
# GitHub Actions
strategy:
  matrix:
    suite: [authentication, dashboard, checkout]
steps:
  - run: npm test -- --profile ${{ matrix.suite }}
```

**File to modify:** `package.json`

```json
{
  "scripts": {
    "test:auth": "cucumber-js features/authentication/ --parallel 2",
    "test:dashboard": "cucumber-js features/dashboard/ --parallel 3",
    "test:checkout": "cucumber-js features/checkout/ --parallel 2"
  }
}
```

---

### 👷 Parallelization with CI Workers

#### GitHub Actions

**File to create:** `.github/workflows/e2e-parallel.yml`

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]  # 4 workers
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: |
          TOTAL_SHARDS=4
          SHARD=${{ matrix.shard }}
          npm test -- --parallel 2
        env:
          TEST_ENV: staging
          BROWSER: chrome
```

#### GitLab CI

**File to create:** `.gitlab-ci.yml`

```yaml
test:
  parallel: 4  # 4 workers
  script:
    - npm ci
    - TEST_ENV=staging npm test -- --parallel 2
```

#### Jenkins Pipeline

**File to create:** `Jenkinsfile`

```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      parallel {
        stage('Worker 1') {
          steps {
            sh 'TEST_ENV=staging npm test -- --parallel 2'
          }
        }
        stage('Worker 2') {
          steps {
            sh 'TEST_ENV=staging BROWSER=firefox npm test -- --parallel 2'
          }
        }
        stage('Worker 3') {
          steps {
            sh 'TEST_ENV=production npm test -- --parallel 2'
          }
        }
      }
    }
  }
}
```

#### Azure DevOps

**File to create:** `azure-pipelines.yml`

```yaml
strategy:
  parallel: 4
pool:
  vmImage: 'ubuntu-latest'
steps:
  - script: npm ci
  - script: TEST_ENV=staging npm test -- --parallel 2
```

---

### 🎯 Optimal Worker Configuration

#### Calculate number of workers

**File to modify:** `cucumber.js`

```javascript
const os = require('os');
const cpuCount = os.cpus().length;

module.exports = {
  default: {
    // Use 50-75% of available CPUs
    parallel: Math.max(1, Math.floor(cpuCount * 0.75)),
    // Or use environment variable
    parallel: process.env.WORKERS || 2
  }
};
```

#### Dynamic scripts

**File to modify:** `package.json`

```json
{
  "scripts": {
    "test:parallel": "cucumber-js --parallel 2",
    "test:parallel:max": "cucumber-js --parallel $(node -e 'console.log(require(\"os\").cpus().length)')"
  }
}
```

---

### ⚠️ When NOT to Parallelize Tests

#### ❌ DO NOT parallelize in these cases:

1. **Tests with shared state dependencies**
   ```gherkin
   # ❌ BAD - Dependent tests
   Scenario: Create user
     When I create a user "test@example.com"
   
   Scenario: Login with created user
     When I log in with "test@example.com"
     # ⚠️ Depends on previous scenario
   ```

2. **Tests that modify global data**
   ```typescript
   // ❌ BAD - Modifies global configuration
   test('change configuration', async () => {
     await setGlobalConfig({ theme: 'dark' });
     // Other tests may fail if they expect theme: 'light'
   });
   ```

3. **Tests with external resource limits**
   - APIs with strict rate limiting
   - Databases with limited connections
   - Third-party services with quotas
   ```bash
   # Run sequentially if there's an API limit
   npm test -- --parallel 1
   ```

4. **Integration tests with shared services**
   ```gherkin
   # ❌ Risky in parallel
   Scenario: Process message queue
     When I send a message to the queue
     And I process the queue
     # ⚠️ Multiple workers may process the same message
   ```

5. **Tests that use specific ports**
   ```typescript
   // ❌ Port conflict in parallel
   test('local server', async () => {
     const server = startServer(3000); // Fixed port
     // Fails if another test uses port 3000
   });
   ```

6. **Performance/load tests**
   ```bash
   # ❌ Invalid results in parallel
   cucumber-js --tags @performance --parallel 1
   ```

7. **Tests with very short execution time**
   ```bash
   # Parallelization overhead > benefit
   # If each test takes < 1 second, may be slower in parallel
   ```

8. **Debugging tests**
   ```bash
   # Debug mode - sequential
   HEADLESS=false npm test -- --parallel 1
   PWDEBUG=1 npm test -- --parallel 1
   ```

---

### ✅ Best Practices for Parallelization

1. **Design independent tests**
   ```gherkin
   # ✅ GOOD - Each scenario is independent
   Scenario: Successful login
     Given I have a unique generated user
     When I log in
     Then I see the dashboard
   ```

2. **Use unique data per test**
   ```typescript
   // ✅ GOOD - Unique email per execution
   const uniqueEmail = `test-${Date.now()}@example.com`;
   ```

3. **Clean up state after each test**
   ```typescript
   After(async function() {
     await this.cleanup(); // Cleans browser, data, etc.
   });
   ```

4. **Monitor system resources**
   ```bash
   # Don't exceed machine capacity
   # Machine with 4 CPUs → use 2-3 workers
   npm test -- --parallel 3
   ```

5. **Balance test distribution**
   ```javascript
   // Distribute evenly by duration, not by quantity
   // Fast tests in one worker, slow tests distributed
   ```

---

### 📊 Complete Configuration Example

**File to modify:** `cucumber.js`

```javascript
const os = require('os');

module.exports = {
  // Default configuration
  default: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: process.env.CI ? 4 : 2,
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json'
    ]
  },
  
  // Smoke tests - fast and critical
  smoke: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 2,
    tags: '@smoke',
    retry: 1
  },
  
  // Regression tests - aggressive parallelization
  regression: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: Math.max(1, Math.floor(os.cpus().length * 0.75)),
    tags: '@regression and not @slow'
  },
  
  // Slow tests - sequential
  slow: {
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    parallel: 1,
    tags: '@slow',
    timeout: 120000
  }
};
```

See **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** for complete CI/CD configurations.

## � Quick Reference - Available Commands

### Test Execution Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm test` | Run all tests + auto-generate report | Default test execution |
| `npm run test:smoke` | Run only tests with @smoke tag | Quick validation tests |
| `npm run test:headed` | Run tests with visible browser | Debugging, development |
| `npm run test:firefox` | Run tests in Firefox browser | Cross-browser testing |
| `npm run test:all` | Run tests + generate report + open in browser | Complete test cycle |

### Report Management Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run serve:report` | **Start report server (RECOMMENDED)** | View reports with delete functionality |
| `npm run test:report` | Open report in browser (static) | Quick report view (no delete) |
| `npm run report:generate` | Generate report from existing results | Manual report regeneration |

### Cleanup Commands

| Command | Description | What It Deletes |
|---------|-------------|-----------------|
| `npm run clean:interactive` | **Interactive cleanup menu (RECOMMENDED)** | Guided cleanup with multiple options |
| `npm run clean` | Remove execution history | `test-results/executions/` + `index.html` |
| `npm run clean:all` | Complete cleanup | Entire `test-results/` folder |

**Interactive cleanup options:**
- Clean execution history
- Clean ALL test results
- Clean videos only
- Clean screenshots only
- Keep last N executions (delete older ones)

### 🎯 Recommended Workflows

#### Development/Debugging Workflow
```bash
# 1. Run tests in headed mode to see what's happening
npm run test:headed

# 2. View detailed report with videos
npm run serve:report

# 3. Click delete button in UI to remove test executions
```

#### CI/CD Pipeline Workflow
```bash
# Run all tests and generate report
npm run test:all

# Artifacts to save:
# - test-results/executions/[timestamp]/ (complete execution)
# - test-results/index.html (main history page)
```

#### Regular Testing Workflow
```bash
# Run tests (report generated automatically)
npm test

# Start server to view all execution history
npm run serve:report

# Delete old executions using UI buttons
```

## 📚 Additional Documentation

- **[EXECUTION_HISTORY.md](./EXECUTION_HISTORY.md)** - Complete guide to execution history system
- **[PIPELINE_CONFIGURATION.md](./PIPELINE_CONFIGURATION.md)** - CI/CD pipeline configurations
- **[REPORTS_WITH_VIDEOS.md](./REPORTS_WITH_VIDEOS.md)** - Video report implementation details
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project structure and organization
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick command reference

## �📄 License

ISC
