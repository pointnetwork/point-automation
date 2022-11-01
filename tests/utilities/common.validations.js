const fs = require('fs');

module.exports = {
    async isAppUninstalled() {
        return !fs.existsSync("/Applications/point.app")
    },
    async isAppInstalled() {
        return fs.existsSync("/Applications/point.app")
    },
    async isFirefoxPageDisplayed(browserHomePage) {
        expect(await browserHomePage.titleLabel).toHaveTextContaining('Welcome to Web 3.0');
        expect(await browserHomePage.walletButton).toBeDisplayed();
        expect(await browserHomePage.blogButton).toBeDisplayed();
        expect(await browserHomePage.pointSocialButton).toBeDisplayed();
        expect(await browserHomePage.emailButton).toBeDisplayed();
    }
}
