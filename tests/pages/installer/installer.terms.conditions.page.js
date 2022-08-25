import Page from '../page'

class InstallerTermsConditionsPage extends Page {
    get understandAndAgreeToContinueButton() {
        return $('//button[@id=\'installer:disclaimerDialog:acceptTermsButton\']')
    }

    get cancelButton() {
        return $('//button[@id=\'installer:disclaimerDialog:rejectTermsButton\']')
    }

    async waitForInstallerToBeDisplayed() {
        await (await this.understandAndAgreeToContinueButton).chromeBrowser.waitForDisplayed()
        await console.log("Installer is displayed")
    }

    async clickOnCancelButton() {
        await super.clickElement((await this.cancelButton).chromeBrowser)
    }

    async clickOnUnderstandAndAgreeButton() {
        await super.clickElement((await this.understandAndAgreeToContinueButton).chromeBrowser)
        await console.log("I Understand button was clicked")
    }
}

export default new InstallerTermsConditionsPage()
