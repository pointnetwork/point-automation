import BrowserHomePage from "../pages/browser/browser.home.page";

const fs = require('fs');

module.exports = {
    async isAppUninstalled() {
        return !fs.existsSync("/Applications/point.app")
    },
    async isAppInstalled() {
        return fs.existsSync("/Applications/point.app")
    },
    async isFirefoxPageDisplayed() {
        expect(BrowserHomePage.titleLabel.firefoxBrowser).toHaveTextContaining('Welcome to Web 3.0');
        expect(BrowserHomePage.walletButton.firefoxBrowser).toBeDisplayed();
        expect(BrowserHomePage.blogButton.firefoxBrowser).toBeDisplayed();
        expect(BrowserHomePage.pointSocialButton.firefoxBrowser).toBeDisplayed();
        expect(BrowserHomePage.emailButton.firefoxBrowser).toBeDisplayed();
    }
}
