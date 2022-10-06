import Page from './page'

class LoginPage extends Page {
    get noGenerateOneButton() {
        return $('#root svg[data-testid=\'KeyIcon\']')
    }

    get yesIHaveItButton() {
        return $('svg[data-testid=\'DownloadIcon\']')
    }

    async waitForPageToBeLoaded() {
        await this.noGenerateOneButton.waitForDisplayed();
        await console.log("Login page is displayed")
    }

    async waitForLoginPage() {
        await console.log("Checking login page...")
        await this.noGenerateOneButton.waitForDisplayed({timeout: 7000});
    }

    async clickOnNoGenerateOne() {
        await super.clickElement(await this.noGenerateOneButton);
    }

    async clickOnYesIHaveIt() {
        await super.clickElement(await this.yesIHaveItButton);
    }
}

export default new LoginPage()
