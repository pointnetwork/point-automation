const { config } = require('./config.conf');
const path = require('path')

const drivers = {
    chrome: { version: '98.0.4758.102' },
    firefox: { version: '0.31.0' },
}

config.capabilities =
    {
        chromeBrowser: {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    binary: '/Applications/point.app/Contents/MacOS/point',
                    args: ["app='/Applications/point.app/Contents/MacOS/point'"]
                }
            }
        }
    }

config.services = [
    ['selenium-standalone', {
        logPath: 'logs',
        installArgs: { drivers }, // drivers to install
        args: { drivers } // drivers to use
    }],
    ['firefox-profile', {
        profileDirectory: '/Users/workmac/point-automation/tests/config/liveprofile'
    }]
];

exports.config = config;
