const { config } = require('./config');

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

exports.config = config;
