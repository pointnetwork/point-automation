import Page from './page'

class LoginExistingAccountPage extends Page {
    get confirmAndLoginButton() {
        return $("//button[text() = 'Confirm & Login']")
    }

    getSecretField(index) {
        return $("input[id='input_" + index + "']")
    }

    async waitForPageToBeLoaded() {
        await this.confirmAndLoginButton.waitForDisplayed();
    }

    async fillSecretWords(secretWords) {
        let counter = 0
        while (counter < 12) {
            const secretField = await this.getSecretField(counter)
            await super.clickElement(secretField);
            await secretField.setValue(secretWords[counter]);
            await super.sendTabKey();
            counter += 1
        }
        console.log('Secret words on metamask were added')
    }

    async clickOnConfirmAndLoginButton() {
        await super.clickElement(this.confirmAndLoginButton);
    }
}

export default new LoginExistingAccountPage()
