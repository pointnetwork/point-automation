import Page from '../page'
import BrowserTransactionModalPage from "./browser.transaction.modal.page";

export default class BrowserIdentityPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get identityTitle() {
        return this.driver.$('//h1')
    }

    get handleValue() {
        return this.driver.$('//th[contains(text(), \'Handle\')]/following-sibling::td')
    }

    get ownerValue() {
        return this.driver.$('//th[contains(text(), \'Owner\')]/following-sibling::td')
    }

    get communicationPublicKeyValue() {
        return this.driver.$('//th[contains(text(), \'Communication Public Key\')]/following-sibling::td')
    }

    get domainSpaceValue() {
        return this.driver.$('//th[contains(text(), \'Domain Space\')]/following-sibling::td')
    }

    get addNewEntryKeyTextbox() {
        return this.driver.$("//input[@name='ikvEntryKey']")
    }

    get addNewEntryValueTextbox() {
        return this.driver.$("//input[@name='ikvEntryValueRef']")
    }

    get addNewEntryVersionTextbox() {
        return this.driver.$("//input[@name='ikvEntryVersion']")
    }

    get addNewEntryAddButton() {
        return this.driver.$("//h5[text() = 'Add new entry']/..//button[text() = 'Add']")
    }

    get deployersAddressTextbox() {
        return this.driver.$("//input[@name='addAddress']")
    }

    get addDeployerAddButton() {
        return this.driver.$("//h3[text() = 'Deployers:']/following-sibling::div//button")
    }

    get allIKVRows() {
        return this.driver.$$("(//table)[2]//tbody//tr")
    }

    get deployersTable() {
        return this.driver.$("(//table)[3]")
    }

    get revokeDeployerButton() {
        return this.driver.$(".btn.btn-sm.btn-danger")
    }

    get firstDeployerRow() {
        return this.driver.$("(//table)[3]//tbody//tr[1]")
    }

    get successDeployerAddedMessage() {
        return this.driver.$("//div[contains(@class, 'swal2-popup')]")
    }

    get successDeployerOkButton() {
        return this.driver.$("//div[contains(@class, 'swal2-popup')]//button[contains(text(), 'OK')]")
    }

    async getIkvNameByRowIndex(index) {
        return this.driver.$("(//table)[2]//tbody//tr["+index+"]//td[1]")
    }

    async getIkvValueByRowIndex(index) {
        return this.driver.$("(//table)[2]//tbody//tr["+index+"]//td[2]")
    }

    async getIkvValueEditTextboxByRowIndex(index) {
        return this.driver.$("(//table)[2]//tbody//tr["+index+"]//td[2]//input")
    }

    async getkvVersionByRowIndex(index) {
        return this.driver.$("(//table)[2]//tbody//tr["+index+"]//td[3]")
    }

    async getIkvEditButtonByRowIndex(index) {
        return this.driver.$("(//table)[2]//tbody//tr["+index+"]//td[4]//button")
    }

    async getIkvSaveButtonByRowIndex(index) {
        return this.driver.$("(//table)[2]//tbody//tr["+index+"]//td[4]//button[1]")
    }

    async getIkvCancelButtonByRowIndex(index) {
        return this.driver.$("(//table)[2]//tbody//tr["+index+"]//td[4]//button[2]")
    }

    async getDeployerNameByRowIndex(index) {
        return this.driver.$("(//table)[3]//tbody//tr["+index+"]//th[1]")
    }

    async getDeployerAddressByRowIndex(index) {
        return this.driver.$("(//table)[3]//tbody//tr["+index+"]//td[1]")
    }

    async getDeployerStatusByRowIndex(index) {
        return this.driver.$("(//table)[3]//tbody//tr["+index+"]//td[2]")
    }

    async getDeployerDateByRowIndex(index) {
        return this.driver.$("(//table)[3]//tbody//tr["+index+"]//td[3]")
    }

    async getDeployerReactiveButtonByRowIndex(index) {
        return this.driver.$("(//table)[3]//tbody//tr["+index+"]//td[4]//button")
    }

    async waitForPageToBeLoaded() {
        await this.identityTitle.waitForDisplayed()
    }

    async clickOnDomainSpace() {
        await super.clickElement(this.domainSpaceValue)
    }

    async addNewEntry(key, value, version) {
        await this.moveToLastIkvRow();
        await super.setValueInElement(this.addNewEntryKeyTextbox, key)
        await super.setValueInElement(this.addNewEntryValueTextbox, value)
        await super.setValueInElement(this.addNewEntryVersionTextbox, version)
        await super.clickElement(this.addNewEntryAddButton)
    }

    async addNewDeployer(address) {
        await browser.pause(5000)
        await this.addDeployerAddButton.scrollIntoView()
        await browser.pause(2000)
        await super.setValueInElement(this.deployersAddressTextbox, address)
        await super.clickElement(this.addDeployerAddButton)
    }

    async clickOnAddNewEntryButton() {
        await super.clickElement(this.addNewEntryAddButton)
    }

    async clickOnEditButtonOnRow(row) {
        const element = await this.getIkvEditButtonByRowIndex(row)
        await super.clickElement(element)
    }

    async editValueOnRow(row, value) {
        const element = await this.getIkvValueEditTextboxByRowIndex(row)
        await super.setValueInElement(element, value)
        await super.clickElement(await this.getIkvSaveButtonByRowIndex(row))
    }

    async moveToLastIkvRow() {
        await browser.pause(5000)
        await this.addDeployerAddButton.scrollIntoView()
        await browser.pause(2000)
    }

    async moveToFirstDeployer() {
        await browser.pause(5000)
        await this.firstDeployerRow.scrollIntoView()
        await browser.pause(2000)
    }

    async revokeDeployerIfDisplayed() {
        try {
            await this.moveToLastIkvRow();
            await this.revokeDeployerButton.waitForDisplayed({timeout:5000})
            if(await this.revokeDeployerButton.isDisplayed()) {
                await super.clickElement(this.revokeDeployerButton);
                const browserTransactionModalPage = await new BrowserTransactionModalPage(this.driver)
                await this.switchToTab("Point Confirmation Window", this.driver)
                await browserTransactionModalPage.clickOnAllow()
                await browserTransactionModalPage.switchToTab("Point Explorer", this.driver)
                await browserTransactionModalPage.waitForSpinnerNotDisplayed(this.driver)
                await this.driver.refresh()
                await this.waitForPageToBeLoaded()
                return "Revoked"
            }
        }catch(exception) {
            console.log("No deployer was found to remove")
            return "Allowed"
        }
    }

    async clickOnReactivateButtonByIndex(index) {
        await super.clickElement(await this.getDeployerReactiveButtonByRowIndex(index))
    }

    async clickOnReactivateButtonByIndexIfNeeded(status, number) {
        if(status === "Revoked") {
            await this.clickOnReactivateButtonByIndex(number)
            const browserTransactionModalPage = await new BrowserTransactionModalPage(this.driver)
            await this.switchToTab("Point Confirmation Window", this.driver)
            await browserTransactionModalPage.clickOnAllow()
            await browserTransactionModalPage.switchToTab("Point Explorer", this.driver)
            await browserTransactionModalPage.waitForSpinnerNotDisplayed(this.driver)
            await this.driver.refresh()
            await this.waitForPageToBeLoaded()
            await this.deployersTable.waitForDisplayed()
        }
    }

    async clickOnDeployerAddedOkButton() {
        await super.clickElement(await this.successDeployerOkButton)
    }
}
