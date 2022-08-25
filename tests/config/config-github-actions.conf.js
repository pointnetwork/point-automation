const { config } = require('./config');

config.capabilities = [
  {
    chromeBrowser: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          binary: '/Users/runner/work/point-automation/point-automation/point.app/Contents/MacOS/point',
          args: ["app='/Users/runner/work/point-automation/point-automation/point.app/Contents/MacOS/point'"]
        }
      }
    },
    firefoxBrowser: {
      capabilities: {
        browserName: 'firefox'
      },
      "moz:firefoxOptions": {
        args: ['-headless']
      },
    }
  }
];
exports.config = config;
