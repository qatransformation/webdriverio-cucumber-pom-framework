#!/usr/bin/env node

/**
 * Script to start the report server and open the browser
 * This script:
 * 1. Checks if a server is already running on port 8080
 * 2. Starts the server in the background if not running
 * 3. Waits for the server to be ready
 * 4. Opens the default browser to the report page
 */

const { spawn, exec } = require('child_process');
const http = require('http');

const PORT = 8080;
const SERVER_URL = `http://localhost:${PORT}`;
const MAX_RETRIES = 10;
const RETRY_DELAY = 500; // milliseconds

console.log('🚀 Starting report server and opening browser...\n');

// Check if server is already running
function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(SERVER_URL, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Wait for server to be ready
async function waitForServer(retries = 0) {
  if (retries >= MAX_RETRIES) {
    console.error(`❌ Server failed to start after ${MAX_RETRIES} attempts`);
    process.exit(1);
  }
  
  const isRunning = await checkServerRunning();
  
  if (isRunning) {
    return true;
  }
  
  // Wait and retry
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  return waitForServer(retries + 1);
}

// Open browser
function openBrowser(url) {
  const command = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
  
  exec(`${command} ${url}`, (error) => {
    if (error) {
      console.error(`❌ Error opening browser: ${error.message}`);
    } else {
      console.log(`✅ Browser opened at: ${url}\n`);
      console.log('📊 Report server is running');
      console.log('🔗 URL: ' + url);
      console.log('\n⌨️  Press Ctrl+C to stop the server\n');
    }
  });
}

// Main execution
(async () => {
  try {
    // Check if server is already running
    const alreadyRunning = await checkServerRunning();
    
    if (alreadyRunning) {
      console.log('✅ Server is already running');
      console.log('🌐 Opening browser...\n');
      openBrowser(SERVER_URL);
      return;
    }
    
    // Start the server
    console.log('🔧 Starting report server...');
    
    const serverProcess = spawn('node', ['src/reports/report-server.js'], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Detach the server process so it runs independently
    serverProcess.unref();
    
    console.log(`📡 Server starting on port ${PORT}...`);
    console.log('⏳ Waiting for server to be ready...\n');
    
    // Wait for server to be ready
    await waitForServer();
    
    console.log('✅ Server is ready!\n');
    
    // Open browser
    openBrowser(SERVER_URL);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
