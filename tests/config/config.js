process.env.TEST = true;

const config = {
    logLevel: 'error',
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            binary: '/Applications/point.app/Contents/MacOS/point',
            args: ["app='/Applications/point.app/Contents/MacOS/point'"]
        }
    }],
    waitforTimeout: 60000,
    connectionRetryCount: 10,
    connectionRetryTimeout: 30000,
    runner: 'local',
    outputDir: 'wdio-logs',
    specs: ['./tests/specs/*.js'],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 360000,
    },
};

module.exports = { config };
