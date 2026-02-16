/**
 * Generates and manages execution timestamp for test runs
 * This timestamp is used to organize test results in separate folders
 */

const fs = require('fs');
const path = require('path');

// Generate timestamp in format: YYYY-MM-DD_HH-MM-SS
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Get or create execution timestamp
function getExecutionTimestamp() {
  const timestampFile = path.join(__dirname, '.execution-timestamp');
  
  // If file exists, read it (for same execution)
  if (fs.existsSync(timestampFile)) {
    return fs.readFileSync(timestampFile, 'utf8').trim();
  }
  
  // Generate new timestamp
  const timestamp = generateTimestamp();
  fs.writeFileSync(timestampFile, timestamp);
  return timestamp;
}

// Clean timestamp file after execution
function cleanTimestampFile() {
  const timestampFile = path.join(__dirname, '.execution-timestamp');
  if (fs.existsSync(timestampFile)) {
    fs.unlinkSync(timestampFile);
  }
}

// Get execution directory path
function getExecutionDir() {
  const timestamp = getExecutionTimestamp();
  return path.join(__dirname, 'test-results', 'executions', timestamp);
}

// Ensure execution directory exists
function ensureExecutionDir() {
  const execDir = getExecutionDir();
  if (!fs.existsSync(execDir)) {
    fs.mkdirSync(execDir, { recursive: true });
  }
  return execDir;
}

module.exports = {
  generateTimestamp,
  getExecutionTimestamp,
  cleanTimestampFile,
  getExecutionDir,
  ensureExecutionDir
};
