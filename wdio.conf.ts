import type { Options } from '@wdio/types';
import video from 'wdio-video-reporter';
const { ensureExecutionDir, getExecutionDir } = require('./src/reports/execution-timestamp');
const fs = require('fs');
const path = require('path');

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
    capabilities: (() => {
        const browsers = (process.env.BROWSER || 'chrome').split(',').map(b => b.trim());
        return browsers.map(browser => {
            const cap: any = {
                browserName: browser,
                acceptInsecureCerts: true
            };
            if (browser === 'firefox') {
                cap['moz:firefoxOptions'] = {
                    args: process.env.HEADLESS === 'true' ? ['-headless'] : []
                };
            } else if (browser === 'chrome') {
                cap['goog:chromeOptions'] = {
                    args: process.env.HEADLESS === 'true' 
                        ? ['--headless', '--disable-gpu', '--window-size=1920,1080']
                        : ['--window-size=1920,1080']
                };
            } else if (browser === 'safari') {
                cap['safari:automaticInspection'] = false;
            }
            return cap;
        });
    })(),

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
    beforeSession: function (config: any, _caps: any, specs: string[]) {
        // Each worker gets its own JSON file based on the spec file being run
        // This prevents workers from overwriting each other's JSON reports
        const specName = specs && specs.length > 0
            ? path.basename(specs[0], '.feature')
            : `worker-${process.pid}`;
        if (config.cucumberOpts && config.cucumberOpts.format) {
            config.cucumberOpts.format = [
                `json:${executionDir}/cucumber-report-${specName}.json`
            ];
        }
    },
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
    after: async function () {
        // Save browser metadata for report generation
        // Using .browser-metadata (no .json extension) to avoid conflict with cucumber-html-reporter
        // @ts-ignore - browser is a global variable in WebdriverIO
        const caps = browser.capabilities || {};
        const metadataPath = path.join(executionDir, '.browser-metadata');
        const browserName = caps.browserName || 'chrome';
        const browserVersion = caps.browserVersion || 'unknown';
        
        const metadata = {
            browserName,
            browserVersion,
            platform: process.platform
        };
        
        // Write metadata file (overwrite to ensure latest version)
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    },
    /**
     * Gets executed right after terminating the webdriver session.
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     */
    onComplete: function() {
        // Merge all per-worker cucumber JSON reports into a single file
        const partialJsonFiles = fs.readdirSync(executionDir)
            .filter((f: string) => f.match(/^cucumber-report-.+\.json$/) && f !== 'cucumber-report.json')
            .map((f: string) => path.join(executionDir, f));

        if (partialJsonFiles.length === 0) {
            console.log('⚠️  No partial cucumber JSON files found to merge');
            return;
        }

        const mergedData: any[] = [];

        partialJsonFiles.forEach((file: string) => {
            try {
                const data = JSON.parse(fs.readFileSync(file, 'utf8'));
                if (Array.isArray(data)) {
                    mergedData.push(...data);
                }
            } catch (err: any) {
                console.log(`⚠️  Error reading ${path.basename(file)}: ${err.message}`);
            }
        });

        // Write merged report
        const mergedPath = path.join(executionDir, 'cucumber-report.json');
        fs.writeFileSync(mergedPath, JSON.stringify(mergedData, null, 2));
        console.log(`✅ Merged ${partialJsonFiles.length} JSON report(s) into cucumber-report.json (${mergedData.length} feature(s))`);

        // Clean up partial files
        partialJsonFiles.forEach((file: string) => {
            fs.unlinkSync(file);
        });
    },
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
