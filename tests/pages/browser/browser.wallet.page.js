import Page from '../page'

export default class BrowserWalletPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get walletTitle() {
        return this.driver.$('//h1[1]')
    }

    get erc20TokensTitle() {
        return this.driver.$('//h1[2]')
    }

    get walletTable() {
        return this.driver.$('//table[1]')
    }

    get mainnetTable() {
        return this.driver.$('//table[2]')
    }

    get xnetTable() {
        return this.driver.$('//table[3]')
    }

    get ynetTable() {
        return this.driver.$("//table[4]")
    }

    get rinkebyTable() {
        return this.driver.$("//table[5]")
    }

    get allRowsWallet() {
        return this.driver.$$("//table[1]//tbody//tr/td/..")
    }

    get receivePointQRCode() {
        return this.driver.$(".modal-body>div>svg")
    }

    get receiveAddress() {
        return this.driver.$(".modal-body input")
    }

    get receiveCopyPasteIcon() {
        return this.driver.$(".modal-body>div>div svg")
    }

    get receiveCloseButton() {
        return this.driver.$(".modal-footer button")
    }

    get receiveCopyPasteCheckMark() {
        return this.driver.$(".checkmark")
    }

    get recipientAddressTextbox() {
        return this.driver.$("//input[@placeholder=\"Recipient's address\"]")
    }

    get amountTextbox() {
        return this.driver.$("//input[@placeholder=\"Amount\"]")
    }

    get sendCancelButton() {
        return this.driver.$("//*[@class = 'modal-footer']/button[1]")
    }

    get sendSendButton() {
        return this.driver.$("//*[@class = 'modal-footer']/button[2]")
    }

    get notAValidAddressLabel() {
        return this.driver.$("//span[text() = 'Not a valid address']")
    }

    get valueIsRequiredAmountLabel() {
        return this.driver.$("//span[text() = 'Value is required']")
    }

    async waitForPageToBeLoaded() {
        await this.walletTitle.waitForDisplayed()
        await super.waitForListToHaveElements(await this.allRowsWallet)
    }

    async getCurrencyOnWalletTableByIndex(index) {
        const row = await this.allRowsWallet[index]
        return await row.$("td:nth-of-type(1)")
    }

    async getAddressOnWalletTableByIndex(index) {
        const row = await this.allRowsWallet[index]
        return await row.$("td:nth-of-type(2)")
    }

    async getBalanceOnWalletTableByIndex(index) {
        const row = await this.allRowsWallet[index]
        return await row.$("td:nth-of-type(3)")
    }

    async clickOnSendButtonOnWalletTableByIndex(index) {
        const row = await this.allRowsWallet[index]
        const td = await row.$("td:nth-of-type(4) a:nth-of-type(1)")
        await super.clickElement(td)
    }

    async clickOnReceiveButtonOnWalletTableByIndex(index) {
        const row = await this.allRowsWallet[index]
        const td = await row.$("td:nth-of-type(4) a:nth-of-type(2)")
        await super.clickElement(td)
    }

    async clickOnHistoryButtonOnWalletTableByIndex(index) {
        const row = await this.allRowsWallet[index]
        const td = await row.$("td:nth-of-type(4) a:nth-of-type(3)")
        await super.clickElement(td)
    }

    async clickOnCopyPasteButton() {
        await super.clickElement(this.receiveCopyPasteIcon)
    }

    async clickOnCloseButton() {
        await super.clickElement(this.receiveCloseButton)
    }

    async enterSendAddress(address) {
        await super.setValueInElement(this.recipientAddressTextbox, address)
    }

    async enterSendValue(value) {
        await super.setValueInElement(this.amountTextbox, value)
    }

    async clickOnSendButtonSendOption() {
        await super.clickElement(this.sendSendButton)
    }

    async clickOnCancelButtonSendOption() {
        await super.clickElement(this.sendCancelButton)
    }
}
