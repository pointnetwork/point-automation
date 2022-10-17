import Page from '../page'

export default class BrowserTransactionModalPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get allowButton() {
        return this.driver.$('//button[text() = \'Allow\']')
    }

    get cancelButton() {
        return this.driver.$('//button[text() = \'Cancel\']')
    }

    async waitForPageToBeLoaded() {
        await this.handleColumnTable.waitForDisplayed()
        await super.waitForListToHaveElements(await this.allRows)
    }

    async clickOnAllow() {
        await super.clickElementAndWait(this.allowButton, 2000)
    }

    async clickOnCancel() {
        await super.clickElement(this.cancelButton)
    }
}
