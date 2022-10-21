import Page from '../page'

export default class BrowserTopBarPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get walletButton() {
        return this.driver.$('//a[@href=\'/wallet\']')
    }

    get appsButton() {
        return this.driver.$('//a[@href=\'/zapps\']')
    }

    get identitiesButton() {
        return this.driver.$('//a[@href=\'/identities\']')
    }

    get myIdentitiesButton() {
        return this.driver.$('//a[@href=\'/myidentities\']')
    }

    get identityButton() {
        return this.driver.$('//a[contains(@href, \'/identities/\')]')
    }

    async clickOnWallet() {
        await super.clickElement(this.walletButton);
    }

    async clickOnApps() {
        await super.clickElement(this.appsButton);
    }

    async clickOnIdentities() {
        await super.clickElement(this.identitiesButton);
    }

    async clickOnMyIdentitiesButton() {
        await super.clickElement(this.myIdentitiesButton);
    }

    async clickOnIdentityButton() {
        await super.clickElement(this.identityButton);
    }
}
