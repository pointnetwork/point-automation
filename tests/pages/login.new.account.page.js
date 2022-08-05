import Page from './page'

class LoginExistingAccountPage extends Page {
    get importantLabel() {
        return $(".MuiAlert-message")
    }

    get generateButton() {
        return $("//button[text() = 'Generate']")
    }

    get continueButton() {
        return $("//button[text() = 'Continue']")
    }

    getSecretWord(number) {
        return $(".MuiGrid-root.MuiGrid-container .MuiGrid-root.MuiGrid-container div:nth-of-type("+number+")")
    }

    getSecretField(index) {
        return $("input[id='input_" + index + "']")
    }

    get confirmAndLoginButton() {
        return $("//button[text() = 'Confirm & Login']")
    }

    async waitForPageToBeLoaded() {
        await this.importantLabel.waitForDisplayed();
        await this.generateButton.waitForDisplayed();
    }

    async getSecretWords() {
        const secretWords = []
        let word = 0;
        while(word < 12) {
            const wordElement = await this.getSecretWord(word+1);
            await super.waitToHaveText(wordElement);
            await secretWords.push(await wordElement.getText());
            word += 1;
        }

        return secretWords;
    }

    async clickOnGenerate() {
        await super.clickElement(this.generateButton);
    }

    async clickOnContinue() {
        await super.clickElement(this.continueButton);
    }

    async enterThreeFirstWords(word1, word2, word3) {
        await super.setValueInElement(this.getSecretField(0), word1)
        await super.setValueInElement(this.getSecretField(1), word2)
        await super.setValueInElement(this.getSecretField(2), word3)
        await super.sendTabKey()
    }

    async clickOnConfirmAndLoginButton() {
        await super.clickElement(this.confirmAndLoginButton);
    }
}

export default new LoginExistingAccountPage()
