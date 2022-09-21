const fs = require('fs');

module.exports = {
    async isAppUninstalled() {
        return !fs.existsSync("/Applications/point.app")
    },
    async isAppInstalled() {
        return fs.existsSync("/Applications/point.app")
    },
    async isFirefoxPageDisplayed(browserHomePage) {
        expect(browserHomePage.titleLabel).toHaveTextContaining('Welcome to Web 3.0');
        expect(browserHomePage.walletButton).toBeDisplayed();
        expect(browserHomePage.blogButton).toBeDisplayed();
        expect(browserHomePage.pointSocialButton).toBeDisplayed();
        expect(browserHomePage.emailButton).toBeDisplayed();
    }
}
