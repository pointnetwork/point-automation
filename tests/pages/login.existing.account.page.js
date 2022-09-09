import Page from './page'

class LoginExistingAccountPage extends Page {
    get confirmAndLoginButton() {
        return $("//button[text() = 'Confirm & Login']")
    }

    getSecretField(index) {
        return $("input[id='input_" + index + "']")
    }

    async waitForPageToBeLoaded() {
        await (await this.confirmAndLoginButton).chromeBrowser.waitForDisplayed();
    }

    async fillSecretWords(secretWords) {
        let counter = 0
        while (counter < 12) {
            const secretField = (await this.getSecretField(counter)).chromeBrowser
            await super.clickElement(secretField);
            await secretField.setValue(secretWords[counter]);
            await super.sendTabKey();
            counter += 1
        }
        console.log('Secret words were added')
    }

    async clickOnConfirmAndLoginButton() {
        await super.clickElement((await this.confirmAndLoginButton).chromeBrowser);
    }
}

export default new LoginExistingAccountPage()
