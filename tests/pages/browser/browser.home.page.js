import Page from '../page'

export default class BrowserHomePage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get titleLabel() {
        return this.driver.$('h1')
    }

    get walletButton() {
        return this.driver.$('a[href=\'https://point/wallet\']')
    }

    get blogButton() {
        return this.driver.$('a[href=\'https://blog.point\']')
    }

    get pointSocialButton() {
        return this.driver.$('a[href=\'https://social.point\']')
    }

    get emailButton() {
        return this.driver.$('a[href=\'https://email.point\']')
    }

    async waitForPageToBeLoaded() {
        await this.titleLabel.waitForDisplayed();
        //toDo: Disabled for now. It's taking too much time to load
        //await (await this.walletButton).firefoxBrowser.waitForDisplayed({timeout: 120000});
    }

    async clickOnWallet() {
        await super.clickElement(this.walletButton);
    }

    async clickOnBlog() {
        await super.clickElement(this.blogButton);
    }

    async clickOnSocial() {
        await super.clickElement(this.pointSocialButton);
    }

    async clickOnEmail() {
        await super.clickElement(this.emailButton);
    }
}
