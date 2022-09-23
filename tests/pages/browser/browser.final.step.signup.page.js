import Page from '../page'

export default class BrowserFinalStepSignupPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get identityInput() {
        return this.driver.$('//input[@name=\'handle\']')
    }

    get registerButton() {
        return this.driver.$("//button[contains(text(), 'Register')]")
    }

    get sendTheTweetButton() {
        return this.driver.$("//span[text() = 'Send the Tweet']/ancestor::button")
    }

    get sureButton() {
        return this.driver.$("//button[contains(text(), 'Sure!')]")
    }

    async waitForPageToBeLoaded() {
        try {
            await this.identityInput.waitForDisplayed({timeout: 120000});
        }catch(exception){
            await console.log("Refreshing page...")
            await browser.refresh()
            await this.identityInput.waitForDisplayed({timeout: 60000});
        }
    }

    async clickOnRegisterButton() {
        await super.clickElement(this.registerButton);
    }

    async clickOnSureButton() {
        await super.clickElement(this.sureButton);
    }

    async enterUsername(username) {
        await super.setValueInElement(this.identityInput, username);
    }
}

