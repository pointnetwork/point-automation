import Page from './page'

class LoginPage extends Page {
    get noGenerateOneButton() {
        return $('svg[data-testid=\'KeyIcon\']')
    }

    get yesIHaveItButton() {
        return $('svg[data-testid=\'DownloadIcon\']')
    }

    async waitForPageToBeLoaded() {
        await (await this.noGenerateOneButton).chromeBrowser.waitForDisplayed();
    }

    async waitForLoginPage() {
        await (await this.noGenerateOneButton).chromeBrowser.waitForDisplayed({timeout: 7000});
    }

    async clickOnNoGenerateOne() {
        await super.clickElement((await this.noGenerateOneButton).chromeBrowser);
    }

    async clickOnYesIHaveIt() {
        await super.clickElement((await this.yesIHaveItButton).chromeBrowser);
    }
}

export default new LoginPage()
