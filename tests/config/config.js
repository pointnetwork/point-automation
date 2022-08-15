// to use debug option run `DEBUG=true followed by your .conf.js`
/* eslint-disable global-require */
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
    browserType: 'firefox',
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
        },
        firefoxBrowser: {
            capabilities: {
                browserName: 'firefox'
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
    waitforTimeout: 60000, // Default timeout for all waitFor* commands.
    connectionRetryTimeout: 60000, // Default timeout in milliseconds for request if Selenium Grid doesn't send response
    connectionRetryCount: 3, // Default request retries count
    specFileRetries: 1,
    specFileRetriesDelay: 0,
    specFileRetriesDeferred: false,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 360000,
        compilers: ['js:@babel/register'],
        bail: false,
    },
    services: [
        [
            'geckodriver',
            // service options
            {
                // OPTIONAL: Arguments passed to geckdriver executable.
                // Check geckodriver --help for all options. Example:
                // ['--log=debug', '--binary=/var/ff50/firefox']
                // Default: empty array
                args: ['--log=info'],

                // The path where the output of the Geckodriver server should
                // be stored (uses the config.outputDir by default when not set).
                outputDir: './logs'
            }
        ],
        ['firefox-profile', {
            'browser.startup.homepage': 'https://webdriver.io',
            profileDirectory: "/Users/workmac/.point/keystore/liveprofile"
        }]
    ],
    reporters: [
        'spec',
    ],
    //
    // =====
    // Hooks
    // =====
    onPrepare(config, capabilities) {
        console.log("**** Starting test... ****");
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
    },
    afterTest: function (test, context, { error, result, duration, passed, retries }) {},
    /**
     * Gets executed after all workers got shut down and the process is about to exit. It is not
     * possible to defer the end of the process using a promise.
     * @param {Object} exitCode 0 - success, 1 - fail
     */
    onComplete(exitCode, config, capabilities, results) {
        console.log('**** Test Finished ****');
    },
};
