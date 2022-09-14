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
            binary: '/usr/bin/point',
            args: ["app='/usr/bin/point'", '--disable-dev-shm-usage'],
        }
      }
    },
      firefoxBrowser: {
          capabilities: {
              browserName: 'firefox'
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
        profileDirectory: "/home/runner/.point/keystore/liveprofile"
    }]
];

exports.config = config;
