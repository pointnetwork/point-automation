const { config } = require('./config.conf');

config.capabilities =
  {
    chromeBrowser: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
            binary: '/usr/bin/point',
            args: ["app='/usr/bin/point'"]
        }
      }
    }
  }
exports.config = config;
