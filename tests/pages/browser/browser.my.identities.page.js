import Page from '../page'

export default class BrowserMyIdentitiesPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get myIdentitiesTitle() {
        return this.driver.$('//h1')
    }

    get handleLink() {
        return this.driver.$('//td/a[contains(@href, \'/identities/\')]')
    }

    get handleOwner() {
        return this.driver.$('//td[2]')
    }

    get subIdentityTextbox() {
        return this.driver.$('//input[@name=\'register-subidentity\']')
    }

    get registerButton() {
        return this.driver.$('//button[contains(text(), \'Register\')]')
    }

    async waitForPageToBeLoaded() {
        await this.handleLink.waitForDisplayed();
    }

    async clickOnHandle() {
        await super.clickElement(this.handleLink)
    }

    async enterNewSubIdentity(name){
        await super.setValueInElement(this.subIdentityTextbox, name)
    }

    async clickOnRegister() {
        await super.clickElement(this.registerButton)
    }
}
