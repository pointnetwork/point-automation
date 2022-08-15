import Page from '../page'

class BrowserFinalStepSignupPage extends Page {
    get identityInput() {
        return $('//input[@name=\'handle\']')
    }

    get registerButton() {
        return $("//button[contains(text(), 'Register')]")
    }

    get sendTheTweetButton() {
        return $("//span[text() = 'Send the Tweet']/ancestor::button")
    }

    get sureButton() {
        return $("//button[contains(text(), 'Sure!')]")
    }

    async waitForPageToBeLoaded() {
        await (await this.identityInput).firefoxBrowser.waitForDisplayed({timeout: 120000});
    }

    async clickOnRegisterButton() {
        await super.clickElement((await this.registerButton).firefoxBrowser);
    }

    async clickOnSureButton() {
        await super.clickElement((await this.sureButton).firefoxBrowser);
    }

    async enterUsername(username) {
        await super.setValueInElement((await this.identityInput).firefoxBrowser, username);
    }
}

export default new BrowserFinalStepSignupPage()