const { config } = require('./config.conf');
const drivers = {
    chrome: { version: '98.0.4758.102' },
}

config.capabilities =
    {
        chromeBrowser: {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    binary: '/usr/bin/point',
                    args: ["app='/usr/bin/point'"],
                }
            }
        }
    }
config.services = [
    ['selenium-standalone', {
        logPath: 'logs',
        installArgs: { drivers }, // drivers to install
        args: { drivers } // drivers to use
    }]
];
config.pipeline = true
config.pipelineType = "Linux"

exports.config = config;
