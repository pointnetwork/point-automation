import Page from '../page'

class BrowserHomePage extends Page {
    get titleLabel() {
        return $('h1')
    }

    get walletButton() {
        return $('a[href=\'https://point/wallet\']')
    }

    get blogButton() {
        return $('a[href=\'https://blog.point\']')
    }

    get pointSocialButton() {
        return $('a[href=\'https://social.point\']')
    }

    get emailButton() {
        return $('a[href=\'https://email.point\']')
    }

    async waitForPageToBeLoaded() {
        await (await this.titleLabel).firefoxBrowser.waitForDisplayed();
        //toDo: Disabled for now. It's taking too much time to load
        //await (await this.walletButton).firefoxBrowser.waitForDisplayed({timeout: 120000});
    }

    async clickOnWallet() {
        await super.clickElement((await this.walletButton).firefoxBrowser);
    }

    async clickOnBlog() {
        await super.clickElement((await this.blogButton).firefoxBrowser);
    }

    async clickOnSocial() {
        await super.clickElement((await this.pointSocialButton).firefoxBrowser);
    }

    async clickOnEmail() {
        await super.clickElement((await this.emailButton).firefoxBrowser);
    }
}

export default new BrowserHomePage()
