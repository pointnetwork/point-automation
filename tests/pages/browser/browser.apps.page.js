import Page from '../page'

export default class BrowserAppsPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get identitiesTitle() {
        return this.driver.$('//h1')
    }

    get totalLabel() {
        return this.driver.$('//*[contains(text(), \'Total:\')]')
    }

    get handleColumnTable() {
        return this.driver.$('//table//tbody//tr/th[1]')
    }

    get ownerColumnTable() {
        return this.driver.$('//table//tbody//tr/th[2]')
    }

    get appColumnTable() {
        return this.driver.$('//table//tbody//tr/th[3]')
    }

    get allRows() {
        return this.driver.$$("//table//tbody//tr/td/..")
    }

    get rowToScroll() {
        return this.driver.$("//table//tbody//tr[99]")
    }

    get firstRowToScroll() {
        return this.driver.$("//table//tbody//tr[1]")
    }

    async waitForPageToBeLoaded() {
        await this.waitForSpinnerNotDisplayed(this.driver)
        await this.handleColumnTable.waitForDisplayed()
        await super.waitForListToHaveElements(await this.allRows)
    }

    async getHandleOnRowByIndex(index) {
        const row = await this.allRows[index]
        return await row.$("/td[1]")
    }

    async getOwnerOnRowByIndex(index) {
        const row = await this.allRows[index]
        return await row.$("/td[2]")
    }

    async getAppOnRowByIndex(index) {
        const row = await this.allRows[index]
        return await row.$("/td[3]")
    }

    async clickOnHandleByIndex(index) {
        const row = await this.allRows[index]
        const td = await row.$("//td[1]")
        await super.clickElement(td)
    }

    async clickOnAppByIndex(index) {
        const row = await this.allRows[index]
        const td = await row.$("//td[3]")
        await super.clickElement(td)
    }
}
