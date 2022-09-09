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

    async isInstallerDisplayed() {
        try {
            await (await this.understandAndAgreeToContinueButton).chromeBrowser.waitForDisplayed({timeout: 5000})
            await console.log("Installer is displayed")
            return true;
        }catch(exception){
            await console.log("Installer is not displayed. App is installed already.")
            return false;
        }
    }
}

export default new InstallerTermsConditionsPage()
