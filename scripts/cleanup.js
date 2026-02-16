#!/usr/bin/env node

/**
 * Interactive cleanup script for test results and evidence
 * Provides safe deletion options with confirmation prompts
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function getDirectorySize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  
  let totalSize = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      totalSize += getDirectorySize(fullPath);
    } else {
      totalSize += fs.statSync(fullPath).size;
    }
  }
  
  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function countExecutions() {
  const executionsDir = path.join(__dirname, '..', 'test-results', 'executions');
  if (!fs.existsSync(executionsDir)) return 0;
  return fs.readdirSync(executionsDir).filter(item => {
    return fs.statSync(path.join(executionsDir, item)).isDirectory();
  }).length;
}

function deleteDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      deleteDirectory(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
  fs.rmdirSync(dirPath);
}

async function showMenu() {
  console.clear();
  console.log(colorize('═══════════════════════════════════════════════════', 'cyan'));
  console.log(colorize('        TEST RESULTS CLEANUP UTILITY', 'cyan'));
  console.log(colorize('═══════════════════════════════════════════════════', 'cyan'));
  console.log();
  
  const testResultsPath = path.join(__dirname, '..', 'test-results');
  const executionsPath = path.join(testResultsPath, 'executions');
  const indexPath = path.join(testResultsPath, 'index.html');
  
  const totalSize = getDirectorySize(testResultsPath);
  const executionsSize = getDirectorySize(executionsPath);
  const executionCount = countExecutions();
  
  console.log(colorize('📊 Current Status:', 'blue'));
  console.log(`   Total storage used: ${colorize(formatBytes(totalSize), 'yellow')}`);
  console.log(`   Executions stored: ${colorize(executionCount.toString(), 'yellow')}`);
  console.log(`   Executions size: ${colorize(formatBytes(executionsSize), 'yellow')}`);
  console.log(`   Main index exists: ${fs.existsSync(indexPath) ? colorize('Yes', 'green') : colorize('No', 'red')}`);
  console.log();
  
  console.log(colorize('🗑️  Cleanup Options:', 'blue'));
  console.log();
  console.log('  1. ' + colorize('Clean execution history', 'yellow'));
  console.log('     └─ Deletes: executions/ folder + index.html');
  console.log(`     └─ Frees: ${colorize(formatBytes(executionsSize), 'green')}`);
  console.log();
  console.log('  2. ' + colorize('Clean ALL test results', 'red'));
  console.log('     └─ Deletes: Entire test-results/ folder');
  console.log(`     └─ Frees: ${colorize(formatBytes(totalSize), 'green')}`);
  console.log();
  console.log('  3. ' + colorize('Clean videos only', 'yellow'));
  console.log('     └─ Deletes: All .webm video files');
  console.log();
  console.log('  4. ' + colorize('Clean screenshots only', 'yellow'));
  console.log('     └─ Deletes: All .png screenshot files');
  console.log();
  console.log('  5. ' + colorize('Clean old executions (keep last N)', 'yellow'));
  console.log('     └─ Keeps recent executions, deletes older ones');
  console.log();
  console.log('  0. ' + colorize('Exit', 'cyan'));
  console.log();
}

async function cleanExecutionHistory() {
  const executionsPath = path.join(__dirname, '..', 'test-results', 'executions');
  const indexPath = path.join(__dirname, '..', 'test-results', 'index.html');
  
  console.log();
  console.log(colorize('⚠️  WARNING: This will delete all execution history!', 'red'));
  const confirm = await question('Are you sure? Type "yes" to confirm: ');
  
  if (confirm.toLowerCase() === 'yes') {
    if (fs.existsSync(executionsPath)) {
      deleteDirectory(executionsPath);
      console.log(colorize('✅ Deleted executions/', 'green'));
    }
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
      console.log(colorize('✅ Deleted index.html', 'green'));
    }
    console.log(colorize('✅ Execution history cleaned!', 'green'));
  } else {
    console.log(colorize('❌ Operation cancelled', 'yellow'));
  }
}

async function cleanAllResults() {
  const testResultsPath = path.join(__dirname, '..', 'test-results');
  
  console.log();
  console.log(colorize('⚠️  WARNING: This will delete EVERYTHING in test-results/', 'red'));
  const confirm = await question('Are you absolutely sure? Type "DELETE ALL" to confirm: ');
  
  if (confirm === 'DELETE ALL') {
    if (fs.existsSync(testResultsPath)) {
      deleteDirectory(testResultsPath);
      console.log(colorize('✅ All test results deleted!', 'green'));
    } else {
      console.log(colorize('ℹ️  No test results to delete', 'yellow'));
    }
  } else {
    console.log(colorize('❌ Operation cancelled', 'yellow'));
  }
}

async function cleanVideosOnly() {
  const executionsPath = path.join(__dirname, '..', 'test-results', 'executions');
  
  if (!fs.existsSync(executionsPath)) {
    console.log(colorize('ℹ️  No executions found', 'yellow'));
    return;
  }
  
  let videosDeleted = 0;
  let spaceSaved = 0;
  
  const executions = fs.readdirSync(executionsPath);
  for (const execution of executions) {
    const videosDir = path.join(executionsPath, execution, 'videos');
    if (fs.existsSync(videosDir)) {
      const videos = fs.readdirSync(videosDir).filter(f => f.endsWith('.webm'));
      for (const video of videos) {
        const videoPath = path.join(videosDir, video);
        spaceSaved += fs.statSync(videoPath).size;
        fs.unlinkSync(videoPath);
        videosDeleted++;
      }
    }
  }
  
  console.log(colorize(`✅ Deleted ${videosDeleted} video files`, 'green'));
  console.log(colorize(`✅ Freed ${formatBytes(spaceSaved)}`, 'green'));
}

async function cleanScreenshotsOnly() {
  const executionsPath = path.join(__dirname, '..', 'test-results', 'executions');
  
  if (!fs.existsSync(executionsPath)) {
    console.log(colorize('ℹ️  No executions found', 'yellow'));
    return;
  }
  
  let screenshotsDeleted = 0;
  let spaceSaved = 0;
  
  const executions = fs.readdirSync(executionsPath);
  for (const execution of executions) {
    const screenshotsDir = path.join(executionsPath, execution, 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
      const screenshots = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
      for (const screenshot of screenshots) {
        const screenshotPath = path.join(screenshotsDir, screenshot);
        spaceSaved += fs.statSync(screenshotPath).size;
        fs.unlinkSync(screenshotPath);
        screenshotsDeleted++;
      }
    }
  }
  
  console.log(colorize(`✅ Deleted ${screenshotsDeleted} screenshot files`, 'green'));
  console.log(colorize(`✅ Freed ${formatBytes(spaceSaved)}`, 'green'));
}

async function cleanOldExecutions() {
  const executionsPath = path.join(__dirname, '..', 'test-results', 'executions');
  
  if (!fs.existsSync(executionsPath)) {
    console.log(colorize('ℹ️  No executions found', 'yellow'));
    return;
  }
  
  const executions = fs.readdirSync(executionsPath)
    .filter(item => fs.statSync(path.join(executionsPath, item)).isDirectory())
    .sort()
    .reverse(); // Most recent first
  
  console.log();
  console.log(colorize(`📊 Total executions: ${executions.length}`, 'blue'));
  const keep = await question('How many recent executions do you want to KEEP? ');
  const keepCount = parseInt(keep);
  
  if (isNaN(keepCount) || keepCount < 0) {
    console.log(colorize('❌ Invalid number', 'red'));
    return;
  }
  
  if (keepCount >= executions.length) {
    console.log(colorize('ℹ️  All executions will be kept', 'yellow'));
    return;
  }
  
  const toDelete = executions.slice(keepCount);
  console.log(colorize(`⚠️  Will delete ${toDelete.length} old executions`, 'red'));
  const confirm = await question('Confirm? Type "yes": ');
  
  if (confirm.toLowerCase() === 'yes') {
    let spaceSaved = 0;
    for (const execution of toDelete) {
      const execPath = path.join(executionsPath, execution);
      spaceSaved += getDirectorySize(execPath);
      deleteDirectory(execPath);
    }
    console.log(colorize(`✅ Deleted ${toDelete.length} old executions`, 'green'));
    console.log(colorize(`✅ Freed ${formatBytes(spaceSaved)}`, 'green'));
    
    // Regenerate index
    console.log(colorize('🔄 Regenerating index...', 'blue'));
    require('../generate-index.js');
    console.log(colorize('✅ Index regenerated', 'green'));
  } else {
    console.log(colorize('❌ Operation cancelled', 'yellow'));
  }
}

async function main() {
  while (true) {
    await showMenu();
    
    const choice = await question(colorize('Select option (0-5): ', 'cyan'));
    
    switch (choice) {
      case '1':
        await cleanExecutionHistory();
        break;
      case '2':
        await cleanAllResults();
        break;
      case '3':
        await cleanVideosOnly();
        break;
      case '4':
        await cleanScreenshotsOnly();
        break;
      case '5':
        await cleanOldExecutions();
        break;
      case '0':
        console.log(colorize('\n👋 Goodbye!', 'cyan'));
        rl.close();
        return;
      default:
        console.log(colorize('❌ Invalid option', 'red'));
    }
    
    if (choice !== '0') {
      console.log();
      await question(colorize('Press ENTER to continue...', 'cyan'));
    }
  }
}

// Run the script
main().catch(error => {
  console.error(colorize('❌ Error:', 'red'), error.message);
  rl.close();
  process.exit(1);
});
