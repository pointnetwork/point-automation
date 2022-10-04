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
            const secretField = (await this.getSecretField(counter))
            await super.clickElement(secretField);
            await secretField.setValue(secretWords[counter]);
            await super.sendTabKey();
            counter += 1
        }
        console.log('Secret words were added')
    }

    async clickOnConfirmAndLoginButton() {
        await console.log("Clicking on Confirm and Login button..")
        await super.clickElement(await this.confirmAndLoginButton);
        await console.log("Button clicked!")
    }
}

export default new LoginExistingAccountPage()
