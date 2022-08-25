const { config } = require('./config');

config.capabilities = [
  {
    chromeBrowser: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          binary: 'point.app/Contents/MacOS/point',
          args: ["app='point.app/Contents/MacOS/point'"]
        }
      }
    },
    firefoxBrowser: {
      capabilities: {
        browserName: 'firefox'
      }
    }
  }
];
exports.config = config;
