import type { Options } from '@wdio/types';
import video from 'wdio-video-reporter';
const { ensureExecutionDir, getExecutionDir } = require('./execution-timestamp');

// Ensure execution directory exists before tests start
const executionDir = ensureExecutionDir();
console.log(`📁 Test results will be saved to: ${executionDir}`);

export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',

    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './features/**/*.feature'
    ],
    exclude: [],

    //
    // ============
    // Capabilities
    // ============
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: process.env.HEADLESS === 'true' 
                ? ['--headless', '--disable-gpu', '--window-size=1920,1080']
                : ['--window-size=1920,1080']
        },
        acceptInsecureCerts: true
    }] as any,

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://todomvc.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'cucumber',

    // Restart browser between scenarios for complete isolation
    cucumberFeaturesWithLineNumbers: false,
    
    reporters: [
        'spec',
        [video, {
            saveAllVideos: true,  // Save all videos
            videoSlowdownMultiplier: 1, // Normal speed
            videoRenderTimeout: 5,      // Timeout for video rendering
            outputDir: `${executionDir}/videos/`,
            maxTestNameLength: 100
        }]
    ],

    //
    // =====
    // Hooks
    // =====
    /**
     * Gets executed once before all workers get launched.
     */
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * or setup the environment in which the tests will be run.
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
    * Gets executed when a refresh happens.
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }

    //
    // ================
    // Cucumber Options
    // ================
    cucumberOpts: {
        require: [
            './src/steps/**/*.ts',
            './src/support/**/*.ts'
        ],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false,
        // Format options for JSON report
        format: [
            `json:${executionDir}/cucumber-report.json`
        ],
        formatOptions: {
            snippetInterface: 'async-await'
        }
    }
};
