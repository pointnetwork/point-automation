import Page from '../page'

export default class BrowserFirefoxMemoryPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get measureButton() {
        return this.driver.$('#measureButton')
    }

    get filterInput() {
        return this.driver.$(".filterInput")
    }

    get extensionRow() {
        return this.driver.$("//*[@title = 'WebExtensions that are active in this session']")
    }

    async waitForPageLoaded() {
        await this.measureButton.waitForDisplayed()
    }

    async clickOnMeasureButton() {
        await super.clickElement(await this.measureButton)
    }

    async enterFilter(filter) {
        await super.setValueInElement(await this.filterInput, filter);
        await super.sendKeyInElement(await this.filterInput, "Enter")
    }

    async getExtensionURL() {
        await this.extensionRow.waitForDisplayed();
        await browser.pause(5000);
        const value = await this.extensionRow.getText()
        const baseUrlValue = value.split("baseURL=")[1]
        return baseUrlValue.split("/)")[0]
    }
}
