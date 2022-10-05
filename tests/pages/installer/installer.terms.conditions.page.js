import Page from '../page'

class InstallerTermsConditionsPage extends Page {
    get understandAndAgreeToContinueButton() {
        return $('//button[@id=\'installer:disclaimerDialog:acceptTermsButton\']')
    }

    get cancelButton() {
        return $('//button[@id=\'installer:disclaimerDialog:rejectTermsButton\']')
    }

    async waitForInstallerToBeDisplayed() {
        await this.understandAndAgreeToContinueButton.waitForDisplayed()
        await console.log("Installer is displayed")
    }

    async clickOnCancelButton() {
        await super.clickElement(await this.cancelButton)
    }

    async clickOnUnderstandAndAgreeButton() {
        await super.clickElement(await this.understandAndAgreeToContinueButton)
        await console.log("I Understand button was clicked")
    }

    async isInstallerDisplayed() {
        try {
            await this.understandAndAgreeToContinueButton.waitForDisplayed({timeout: 5000})
            await console.log("Installer is displayed")
            return true;
        }catch(exception){
            await console.log("Installer is not displayed. App is installed already.")
            return false;
        }
    }
}

export default new InstallerTermsConditionsPage()
