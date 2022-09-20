const { config } = require('./config.conf');
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
          binary: '/Users/runner/work/point-automation/point-automation/point.app/Contents/MacOS/point',
          args: ["app='/Users/runner/work/point-automation/point-automation/point.app/Contents/MacOS/point'"]
        }
      }
    // },
    //   firefoxBrowser: {
    //       capabilities: {
    //           browserName: 'firefox'
    //       }
      }
  }

config.services = [
    ['selenium-standalone', {
        logPath: 'logs',
        installArgs: { drivers }, // drivers to install
        args: { drivers } // drivers to use
    }],
    ['firefox-profile', {
        profileDirectory: "/Users/runner/.point/keystore/liveprofile"
    }]
];
exports.config = config;
