import Page from './page'

class LoginPage extends Page {
    get noGenerateOneButton() {
        return $('svg[data-testid=\'KeyIcon\']')
    }

    get yesIHaveItButton() {
        return $('svg[data-testid=\'DownloadIcon\']')
    }

    async waitForPageToBeLoaded() {
        await this.noGenerateOneButton.waitForDisplayed();
    }

    async clickOnNoGenerateOne() {
        await super.clickElement(this.noGenerateOneButton);
    }

    async clickOnYesIHaveIt() {
        await super.clickElement(this.yesIHaveItButton);
    }
}

export default new LoginPage()
