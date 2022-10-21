import Page from '../page'

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

    async waitForPageToBeLoaded() {
        await this.identityTitle.waitForDisplayed()
    }

    async clickOnDomainSpace() {
        await super.clickElement(this.domainSpaceValue)
    }

    async addNewEntry(key, value, version) {
        await this.addDeployerAddButton.scrollIntoView()
        await super.setValueInElement(this.addNewEntryKeyTextbox, key)
        await super.setValueInElement(this.addNewEntryValueTextbox, value)
        await super.setValueInElement(this.addNewEntryVersionTextbox, version)
        await super.clickElement(this.addNewEntryAddButton)
    }

    async addNewDeployer(address) {
        await super.setValueInElement(this.deployersAddressTextbox, address)
        await super.clickElement(this.addDeployerAddButton)
    }

    async clickOnAddNewEntryButton() {
        await super.clickElement(this.addNewEntryAddButton)
    }
}
