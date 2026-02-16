import { Before, After, BeforeAll, AfterAll } from '@wdio/cucumber-framework';
import { CustomWorld } from './world';
import { browser } from '@wdio/globals';
const { getExecutionDir } = require('../reports/execution-timestamp');

/**
 * Global hooks for test configuration
 */

BeforeAll(async function () {
  console.log('🚀 Starting test suite with WebdriverIO...');
});

Before(async function (this: CustomWorld, { pickle }) {
  console.log(`\n📝 Running: ${pickle.name}`);
  
  // Record start time for duration calculation
  this.startTime = Date.now();
  
  // Navigate to TodoMVC app before each scenario to ensure clean state
  await browser.url('https://todomvc.com/examples/typescript-react/');
  
  // Clear localStorage to ensure clean state between tests
  await browser.execute(() => {
    localStorage.clear();
  });
  
  // Reload the page after clearing localStorage
  await browser.refresh();
  
  // Wait for the page to be fully loaded
  await browser.pause(500);
  
  console.log('🧹 Browser navigated to clean state with cleared localStorage');
});

After(async function (this: CustomWorld, { pickle, result }) {
  const timestamp = new Date().getTime();
  
  // Calculate test duration
  const durationMs = this.startTime ? timestamp - this.startTime : 0;
  const durationSeconds = (durationMs / 1000).toFixed(2);
  
  const testFailed = result?.status === 'FAILED';
  const testPassed = result?.status === 'PASSED';
  
  // If test fails, attach comprehensive error information
  if (testFailed) {
    console.log(`\n❌ TEST FAILED: "${pickle.name}"\n`);
    
    // 1. Capture and attach error message
    if (result.message) {
      const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ ERROR MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${result.message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();
      
      this.attach(errorMessage, 'text/plain');
      console.log(errorMessage);
    }
    
    // 2. Capture browser console logs
    try {
      const logs = await browser.getLogs('browser');
      if (logs && logs.length > 0) {
        const consoleLogsText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  BROWSER CONSOLE LOGS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${logs.map(log => `[${log.level}] ${new Date(log.timestamp).toISOString()} - ${log.message}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
        
        this.attach(consoleLogsText, 'text/plain');
        console.log(`📋 Captured ${logs.length} browser console log(s)`);
      }
    } catch (error) {
      console.log('⚠️  Could not capture browser logs:', error);
    }
    
    // 3. Capture current page info
    try {
      const currentUrl = await browser.getUrl();
      const pageTitle = await browser.getTitle();
      const pageSource = await browser.getPageSource();
      
      const pageInfo = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 PAGE INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 URL: ${currentUrl}
📄 Title: ${pageTitle}
📏 HTML Size: ${(pageSource.length / 1024).toFixed(2)} KB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();
      
      this.attach(pageInfo, 'text/plain');
    } catch (error) {
      console.log('⚠️  Could not capture page info:', error);
    }
    
    // 4. Take screenshot if test fails
    try {
        const executionDir = getExecutionDir();
        const screenshotDir = `${executionDir}/screenshots`;
        const screenshotName = testFailed ? 'failure' : 'success';
        const screenshotPath = `${screenshotDir}/${screenshotName}-${pickle.name.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.png`;
        
        // Create directory if doesn't exist
        const fs = require('fs');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        await browser.saveScreenshot(screenshotPath);
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        
        // Attach screenshot to report
        const screenshot = fs.readFileSync(screenshotPath);
        this.attach(screenshot, 'image/png');
      } catch (error) {
        console.error('❌ Error capturing screenshot:', error);
      }
  } else {
    // For passed tests, also take screenshot
    try {
        const executionDir = getExecutionDir();
        const screenshotDir = `${executionDir}/screenshots`;
        const screenshotPath = `${screenshotDir}/success-${pickle.name.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.png`;
        
        // Create directory if doesn't exist
        const fs = require('fs');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        await browser.saveScreenshot(screenshotPath);
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        
        // Attach screenshot to report
        const screenshot = fs.readFileSync(screenshotPath);
        this.attach(screenshot, 'image/png');
      } catch (error) {
        console.error('❌ Error capturing screenshot:', error);
      }
  }
  
  // 5. Attach comprehensive failure information (only for failures)
  if (testFailed) {
    const failureInfo = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 FAILURE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Scenario: ${pickle.name}
📂 Feature: ${pickle.uri}
🏷️  Tags: ${pickle.tags.map(t => t.name).join(', ') || 'No tags'}
⏱️  Duration: ${durationSeconds}s
📅 Timestamp: ${new Date().toLocaleString('en-US')}
🖥️  Platform: ${process.platform} (${process.arch})
🌐 Node Version: ${process.version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TROUBLESHOOTING TIPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Check the screenshot above for visual state
2. Review browser console logs for JavaScript errors
3. Verify page URL and title are as expected
4. Check video recording for the exact failure moment
5. Review element selectors if interaction failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
    
    this.attach(failureInfo, 'text/plain');
  }
  
  // Attach execution logs for all tests (passed or failed)
  const executionLog = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EXECUTION LOG:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scenario: ${pickle.name}
Status: ${result?.status || 'UNKNOWN'}
Duration: ${durationSeconds}s
Steps: ${pickle.steps?.length || 0}
Tags: ${pickle.tags.map(t => t.name).join(', ') || 'None'}
Timestamp: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  
  this.attach(executionLog, 'text/plain');
  
  // Final status message
  const statusEmoji = result?.status === 'PASSED' ? '✅' : '❌';
  const statusText = result?.status === 'PASSED' ? 'Test completed' : 'Test FAILED';
  console.log(`${statusEmoji} ${statusText}: ${pickle.name}`);
  
  // NOTE: reloadSession() provides complete browser isolation but breaks video recording
  // If video recording is more important than complete isolation, comment this out
  // console.log('🔄 Reloading browser session (closing and reopening)...');
  // await browser.reloadSession();
  // console.log('✅ New browser session started\n');
  
  // Alternative: Just clear state without closing browser (allows video recording)
  await browser.url('https://todomvc.com/examples/typescript-react/');
  await browser.execute(() => localStorage.clear());
  await browser.refresh();
  console.log('🧹 Browser state cleared for next scenario\n');
});

AfterAll(async function () {
  console.log('\n🏁 Test suite completed');
});
