const { config } = require('./config.conf');

config.capabilities =
  {
    chromeBrowser: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          binary: '/Users/runner/work/point-automation/point-automation/point.app/Contents/MacOS/point',
          args: ["app='/Users/runner/work/point-automation/point-automation/point.app/Contents/MacOS/point'"]
        }
      }
    }
  }
exports.config = config;
