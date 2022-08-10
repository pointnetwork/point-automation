const fs = require('fs');

module.exports = {
    async isAppUninstalled() {
        return !fs.existsSync("/Applications/point.app")
    },
    async isAppInstalled() {
        return fs.existsSync("/Applications/point.app")
    }
}
