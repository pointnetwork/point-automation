import Page from '../page'

export default class BrowserFirefoxExtensionPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get globalChainIdSelector() {
        return this.driver.$('//span[text() = \'Global Chain ID:\']/following-sibling::div//div[@aria-haspopup = \'listbox\']')
    }

    get optionsSelector() {
        return this.driver.$$('//ul//li')
    }

    get loggedInAsUser() {
        return this.driver.$('//span[text() = \'Logged in as\']/following-sibling::div//p')
    }

    get loggedInAsId() {
        return this.driver.$('//span[text() = \'Logged in as\']/following-sibling::div//span')
    }

    get availableBalance() {
        return this.driver.$("//span[text() = 'Available Balance']/following-sibling::div//h4")
    }

    get sendMoneyButton() {
        return this.driver.$("//button[text() = 'Send Money']")
    }

    get pointExplorerButton() {
        return this.driver.$("//p[text() = 'Point Explorer']")
    }

    get myWalletButton() {
        return this.driver.$("//p[text() = 'My Wallet']")
    }

    get sdkVersion() {
        return this.driver.$("//img[@alt='point-logo']/following-sibling::span")
    }

    async waitForPageLoaded() {
        await this.sendMoneyButton.waitForDisplayed()
    }

    async clickOnGlobalChainIdSelector() {
        await super.clickElement(await this.globalChainIdSelector)
    }

    async clickOnPointExplorer() {
        await super.clickElement(await this.pointExplorerButton)
    }

    async clickOnMyWalletButton() {
        await super.clickElement(await this.myWalletButton)
    }

    async clickOnGlobalChainSelectorOptionByIndex(index) {
        await super.clickElement(await this.optionsSelector[index])
    }
}
