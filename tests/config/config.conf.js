// to use debug option run `DEBUG=true followed by your .conf.js`
/* eslint-disable global-require */
const wdioHtmlReporter = require('@rpii/wdio-html-reporter')
const log4j = require('log4js')
const path = require('path')
const fs = require('fs')
const drivers = {
    chrome: { version: '98.0.4758.102' },
    firefox: { version: '0.31.0' },
}
const BashProcesses = require('../utilities/bash.processes')


function rmdir (dir) {
    try {
        const list = fs.readdirSync(dir)
        for (let i = 0; i < list.length; i++) {
            const filename = path.join(dir, list[i])
            const stat = fs.statSync(filename)

            if (filename === '.' || filename === '..') {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename)
            } else {
                // rm fiilename
                fs.unlinkSync(filename)
            }
        }
        fs.rmdirSync(dir)
    } catch (exception) {
        console.log('It was not possible to remove directory. Exception : ' + exception)
    }
}

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `WebdriverIO` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    specs: ['./tests/specs/*.js'],
    // Patterns to exclude.
    exclude: [],
    pipeline: false,
    //
    // ============
    // Capabilities
    // ============
    //
    maxInstances: 1,
    capabilities: {
        chromeBrowser: {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    binary: '/Applications/point.app/Contents/MacOS/point',
                    args: ["app='/Applications/point.app/Contents/MacOS/point'"]
                }
            }
        }
    },
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async way
    // e.g. using promises you can set the sync option to false.
    logLevel: 'error', // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevels: {
        webdriver: 'error',
        '@wdio/cli:Launcher': 'error',
        '@wdio/local-runner': 'error',
        '@wdio/utils:initialiseServices': 'error',
    },
    // Warns when a deprecated command is used
    deprecationWarnings: true,
    waitforTimeout: 90000, // Default timeout for all waitFor* commands.
    connectionRetryTimeout: 30000, // Default timeout in milliseconds for request if Selenium Grid doesn't send response
    connectionRetryCount: 3, // Default request retries count
    specFileRetries: 0,
    specFileRetriesDelay: 10,
    specFileRetriesDeferred: false,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 1800000,
        compilers: ['js:@babel/register'],
        bail: false,
    },
    services: [
        ['selenium-standalone', {
            logPath: 'logs',
            installArgs: { drivers }, // drivers to install
            args: { drivers } // drivers to use
        }]
    ],
    reporters: [
        'spec',
        [
            wdioHtmlReporter.HtmlReporter,
            {
                debug: false,
                outputDir: './tests/reports/html-reports/',
                filename: 'report.html',
                reportTitle: 'Test Automation Report',

                // to show the report in a browser when done
                showInBrowser: false,

                // to turn on screenshots after every test
                useOnAfterCommandForScreenshot: false,
                LOG: log4j.getLogger('default')
            }
        ]
    ],
    //
    // =====
    // Hooks
    // =====
    onPrepare (config, capabilities) {
        console.log('**** Starting test... ****')
        const screenshotsFolder = './tests/reports/screenshots'
        const pathForLog = './tests/reports/logs'

        if (!fs.existsSync(screenshotsFolder)) {
            // if it doesn't exist, create it
            fs.mkdirSync(screenshotsFolder, { recursive: true })
        } else {
            rmdir(screenshotsFolder)
            fs.mkdirSync(screenshotsFolder, { recursive: true })
        }

        if (!fs.existsSync(pathForLog)) {
            // if it doesn't exist, create it
            fs.mkdirSync(pathForLog, { recursive: true })
        }
        const reportAggregator = new wdioHtmlReporter.ReportAggregator({
            outputDir: './tests/reports/html-reports/',
            filename: 'master-report.html',
            reportTitle: 'Master Report'
            // to use the template override option, can point to your own file in the test project:
            // templateFilename: path.resolve(__dirname, '../template/wdio-html-reporter-alt-template.hbs')
        })

        reportAggregator.clean()

        global.reportAggregator = reportAggregator
    },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    beforeSession() {
        require('@babel/register');
    },
    /**
     // Gets executed before test execution begins. At this point you can access all global
     // variables, such as `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before() {
        /**
         * Setup the Chai assertion framework
         */
        const chai = require('chai');
        global.assert = chai.assert;
        global.should = chai.should();
        console.log("Browser version : " + browser.capabilities['browserVersion'])
    },
    afterTest (test) {
        try {
            const path = require('path')
            const moment = require('moment')

            // if test passed, ignore, else take and save screenshot.
            // if (test.passed) {
            //     return
            // }
            const timestamp = moment().format('YYYYMMDD-HHmmss.SSS')
            const filepath = path.join(
                'tests/reports/html-reports/screenshots/',
                `${timestamp}.png`
            )
            browser.saveScreenshot(filepath)
            process.emit('test:screenshot', filepath)
        } catch (exception) {
            console.log('It was not possible to take screenshot after test. Error : ' + exception)
        }

        try {
            console.log("Test case finished. Killing Firefox instances...")
            BashProcesses.killAllFirefoxProcesses().then(result => {
                console.log("Firefox Killed correctly.")
            });
            browser.pause(5000);
        } catch (exception) {
            console.log("Error killing point when test case is finished.")
        }
    },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. It is not
     * possible to defer the end of the process using a promise.
     * @param {Object} exitCode 0 - success, 1 - fail
     */
    onComplete (exitCode, config, capabilities, results) {
        console.log('**** Test Finished ****')
        try {
            (async () => {
                await global.reportAggregator.createReport()
            })()
        } catch (exception) {
            console.log('Error creating report aggregator : ' + exception)
        }
    },
    suites: {
        github_actions: [
            './tests/specs/open.close.browser.spec.js',
            './tests/specs/remove.point.folder.login.test.spec.js',
            './tests/specs/remove.point.folder.signup.test.spec.js',
            './tests/specs/logout.existing.key.spec.js',
            './tests/specs/logout.generate.new.key.not.closing.browser.spec.js',
            './tests/specs/logout.generate.new.key.spec.js',
            './tests/specs/open.close.dashboard.spec.js',
            './tests/specs/generate.new.key.new.identity.browser.spec.js',
            './tests/specs/verify.browser.page.spec.js',
        ],
        github_actions_linux: [
            // './tests/specs/open.close.browser.spec.js',
            // './tests/specs/remove.point.folder.login.test.spec.js',
            // './tests/specs/remove.point.folder.signup.test.spec.js',
            './tests/specs/logout.existing.key.spec.js',
            // './tests/specs/logout.generate.new.key.not.closing.browser.spec.js',
            // './tests/specs/logout.generate.new.key.spec.js',
        ]
    },
};
