# 🎯 WebdriverIO + Cucumber + Page Object Model Framework

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WebdriverIO](https://img.shields.io/badge/WebdriverIO-EA5906?style=for-the-badge&logo=webdriverio&logoColor=white)](https://webdriver.io/)
[![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=for-the-badge&logo=cucumber&logoColor=white)](https://cucumber.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Professional UI test automation framework featuring WebdriverIO v9, Cucumber BDD, Page Object Model pattern, and comprehensive video recording with enhanced HTML reports.

## ✨ Key Features

- 🌐 **WebdriverIO v9.24.0** - Modern browser automation
- 🥒 **Cucumber BDD** - Behavior-driven testing with Gherkin
- 📄 **Page Object Model** - Maintainable test architecture
- 📹 **Video Recording** - Automatic video capture (saved to disk)
- 📸 **Screenshots** - Automatic screenshot capture
- 📊 **Enhanced Reports** - Fast HTML reports with execution history
- 📝 **Execution History** - Track all test runs with timestamps
- 🧹 **Interactive Cleanup** - Manage test artifacts and disk space
- 🎯 **Tag-based Execution** - Run tests by tags (@smoke, @regression, etc.)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/qatransformation/webdriverio-cucumber-pom-framework.git
cd webdriverio-cucumber-pom-framework

# Install dependencies
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests and open report automatically
npm run test:open

# Run smoke tests
npm run test:smoke:open

# Run tests with specific tag
npm run test:tag:open -- '@yourTag'
```

## 📖 Documentation

Complete documentation is available in the [`docs/`](docs/) folder:

### 📘 Getting Started
- **[Documentation Index](docs/README.md)** - Complete documentation hub
- **[Quick Reference](docs/guides/QUICK_REFERENCE.md)** - Essential commands
- **[Usage Guide](docs/guides/USAGE_GUIDE.md)** - Detailed usage instructions
- **[Environment Setup](docs/guides/ENVIRONMENT_SETUP_SUMMARY.md)** - Setup guide

### 🏗️ Architecture
- **[Architecture Overview](docs/architecture/ARCHITECTURE.md)** - System design
- **[Project Summary](docs/architecture/PROJECT_SUMMARY.md)** - Project structure
- **[Validation Strategy](docs/architecture/VALIDATION.md)** - Testing approach

### 📊 Reports & Evidence
- **[Reports with Videos](docs/reports/REPORTS_WITH_VIDEOS.md)** - Video recording guide
- **[Execution History](docs/reports/EXECUTION_HISTORY.md)** - History management
- **[Enhanced Reports](docs/reports/ENHANCED_REPORT.md)** - Advanced reporting features

### 🔧 CI/CD
- **[Pipeline Configuration](docs/PIPELINE_CONFIGURATION.md)** - Jenkins and CI/CD setup

## 📁 Project Structure

```
webdriverio_cucumber_pom/
├── features/              # 🥒 Cucumber feature files
│   └── todomvc.feature    # Test scenarios
├── src/
│   ├── pages/             # 📄 Page Objects
│   │   ├── BasePage.ts    # Base page class
│   │   └── TodoPage.ts    # Application page
│   ├── steps/             # 🔧 Step definitions
│   │   └── todo.steps.ts  # Test steps
│   ├── support/           # 🛠️ Test support
│   │   ├── hooks.ts       # Before/After hooks
│   │   └── world.ts       # Custom World
│   ├── utils/             # 🔨 Utilities
│   └── reports/           # 📊 Report generation
│       ├── generate-report.js      # Report generator
│       ├── generate-index.js       # Index generator
│       ├── report-server.js        # HTTP server
│       ├── post-process-report.js  # Post-processor
│       └── execution-timestamp.js  # Timestamp utils
├── test-results/          # 📊 Test results
│   ├── index.html         # Main execution history
│   └── executions/        # Individual execution folders
├── scripts/               # 🧹 Utility scripts
│   └── cleanup.js         # Interactive cleanup
├── docs/                  # 📚 Documentation
└── wdio.conf.ts          # ⚙️ WebdriverIO config
```

## 🎬 Video Recording

All test executions are automatically recorded:
- **Format:** WebM
- **Location:** `test-results/executions/<timestamp>/videos/`
- **Embedded in:** Feature detail pages (`.../features/*.html`)
- **Access:** Click on feature → "+View Video" link
- **Note:** Videos NOT in execution index for faster loading

## 📊 Reports

### Execution History

View all test executions in one place:
```bash
npm run test:report
# or
npm run serve:report  # Start HTTP server
```

### Report Features

- 📹 Videos in feature pages ("+View Video" links)
- 📸 Screenshots on all tests
- 📝 Detailed step-by-step execution
- 🔍 Browser console logs on failures
- ⏱️ Execution duration per scenario
- 📊 Statistics dashboard
- ⚡ Fast loading execution index

## 🧹 Cleanup Utilities

Manage disk space with the interactive cleanup menu:

```bash
npm run clean:interactive
```

**Options:**
1. Delete only videos (keep reports and screenshots)
2. Delete videos and screenshots (keep reports)
3. Delete all executions (keep main index)
4. Delete everything (complete cleanup)
5. Cancel

**Quick commands:**
```bash
npm run clean      # Remove executions and index
npm run clean:all  # Remove entire test-results/
```

## 📝 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests + auto-generate report |
| `npm run test:open` | Run tests and open report in browser |
| `npm run test:smoke` | Run tests with @smoke tag |
| `npm run test:smoke:open` | Run smoke tests and open report |
| `npm run test:tag -- '@tag'` | Run tests with specific tag |
| `npm run test:tag:open -- '@tag'` | Run tagged tests and open report |
| `npm run test:headed` | Run with visible browser |
| `npm run test:firefox` | Run in Firefox |
| `npm run test:report` | Open main report index |
| `npm run serve:report` | Start HTTP server for reports |
| `npm run clean` | Clean executions |
| `npm run clean:all` | Clean all results |
| `npm run clean:interactive` | Interactive cleanup menu |

## 🔧 Configuration

### Browser Settings

Edit `wdio.conf.ts` to configure:
- Browser capabilities
- Timeouts
- Base URL
- Video recording settings

### Tag-based Execution

Use Cucumber tags in feature files:
```gherkin
@smoke @critical
Scenario: Critical functionality
  Given ...
```

Run specific tags:
```bash
npm run test:tag:open -- '@smoke'
npm run test:tag:open -- '@smoke and not @slow'
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**QA Transformation to IA**
- Website: [www.qatransformation.ai](https://www.qatransformation.ai)
- GitHub: [@qatransformation](https://github.com/qatransformation)

## 📚 Additional Resources

- [WebdriverIO Documentation](https://webdriver.io/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Page Object Model Pattern](https://webdriver.io/docs/pageobjects/)

## � Documentation

- [Architecture](docs/architecture/ARCHITECTURE.md) - Framework architecture and design patterns
- [SauceDemo Feature Guide](docs/guides/SAUCEDEMO_FEATURE.md) - SauceDemo login tests documentation
- [Pipeline Configuration](docs/PIPELINE_CONFIGURATION.md) - CI/CD setup guide

## �📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
