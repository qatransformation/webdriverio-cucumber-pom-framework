# 📚 Documentation Index

Welcome to the WebdriverIO + Cucumber + POM Framework documentation.

## 📖 Quick Start
- **[Main README](../README.md)** - Project overview and getting started
- **[CHANGELOG](../CHANGELOG.md)** - Version history and changes

---

## 📂 Documentation Structure

### 🏗️ Architecture
Learn about the framework design and structure.

- **[ARCHITECTURE.md](architecture/ARCHITECTURE.md)** - Complete system architecture
- **[PROJECT_SUMMARY.md](architecture/PROJECT_SUMMARY.md)** - Project overview
- **[VALIDATION.md](architecture/VALIDATION.md)** - Testing approach and validation strategy
- **[architecture-diagram.mmd](architecture/architecture-diagram.mmd)** - Mermaid diagram of the system

### 📘 Usage Guides
Step-by-step guides for using the framework.

- **[USAGE_GUIDE.md](guides/USAGE_GUIDE.md)** - Complete usage guide
- **[QUICK_REFERENCE.md](guides/QUICK_REFERENCE.md)** - Quick reference for commands
- **[TODOMVC_QUICK_REF.md](guides/TODOMVC_QUICK_REF.md)** - TodoMVC specific testing guide
- **[ENVIRONMENT_SETUP_SUMMARY.md](guides/ENVIRONMENT_SETUP_SUMMARY.md)** - Environment setup instructions

### 📊 Reports & Evidence
Everything about test reports, videos, and screenshots.

- **[REPORTS_WITH_VIDEOS.md](reports/REPORTS_WITH_VIDEOS.md)** - How video recording works
- **[VIDEO_RECORDING.md](reports/VIDEO_RECORDING.md)** - Video recording configuration
- **[VIDEO_REPORT_INTEGRATION.md](reports/VIDEO_REPORT_INTEGRATION.md)** - Video integration in reports
- **[EXECUTION_HISTORY.md](reports/EXECUTION_HISTORY.md)** - Execution history management
- **[ENHANCED_REPORT.md](reports/ENHANCED_REPORT.md)** - Enhanced reporting features

### 🔧 CI/CD
Continuous Integration and Deployment configuration.

- **[PIPELINE_CONFIGURATION.md](PIPELINE_CONFIGURATION.md)** - Jenkins and CI/CD pipeline setup

---

## 🎯 Common Tasks

### Running Tests
```bash
npm test                    # Run all tests
npm run test:open           # Run tests and open report
npm run test:smoke          # Run smoke tests
npm run test:smoke:open     # Run smoke tests and open report
```

### Managing Reports
```bash
npm run test:report         # Open report in browser
npm run serve:report        # Start HTTP server for reports
```

### Cleanup
```bash
npm run clean               # Clean executions
npm run clean:all           # Clean everything
npm run clean:interactive   # Interactive cleanup menu
```

---

## 📝 File Organization

```
webdriverio_cucumber_pom/
├── README.md                      # Main documentation
├── CHANGELOG.md                   # Version history
├── package.json                   # Project configuration
├── wdio.conf.ts                   # WebdriverIO configuration
├── docs/                          # 📚 All documentation
│   ├── README.md                  # This file
│   ├── architecture/              # 🏗️ Architecture docs
│   ├── guides/                    # 📘 Usage guides
│   ├── reports/                   # 📊 Reporting docs
│   └── PIPELINE_CONFIGURATION.md  # 🔧 CI/CD config
├── features/                      # 🥒 Cucumber features
├── src/                           # 💻 Source code
│   ├── pages/                     # Page Objects
│   ├── steps/                     # Step definitions
│   ├── support/                   # Hooks and helpers
│   └── utils/                     # Utilities
├── test-results/                  # 📊 Test execution results
├── scripts/                       # 🛠️ Utility scripts
└── test-data/                     # 📦 Test data
```

---

## 🆘 Need Help?

1. Check the **[QUICK_REFERENCE.md](guides/QUICK_REFERENCE.md)** for common commands
2. Review the **[USAGE_GUIDE.md](guides/USAGE_GUIDE.md)** for detailed instructions
3. Check the **[ARCHITECTURE.md](architecture/ARCHITECTURE.md)** to understand the system design
4. Look at **[REPORTS_WITH_VIDEOS.md](reports/REPORTS_WITH_VIDEOS.md)** for reporting questions

---

## 🔗 External Resources

- [WebdriverIO Documentation](https://webdriver.io/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Page Object Model Pattern](https://webdriver.io/docs/pageobjects/)
- [TodoMVC](https://todomvc.com/)
