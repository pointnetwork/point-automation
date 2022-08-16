import Page from '../page'

class InstallerWelcomePage extends Page {
    get startInstallationButton() {
        return $('//button[@id=\'installer:app:startInstallationButton\']')
    }

    get installingTitle() {
        return $("//*[text() = 'Installing']")
    }

    async waitForInstallerToBeDisplayed() {
        await (await this.startInstallationButton).chromeBrowser.waitForDisplayed()
    }

    async clickOnStartInstallationButton() {
        await super.clickElement((await this.startInstallationButton).chromeBrowser)
    }

    async waitForInstallationCompleted() {
        await (await this.installingTitle).chromeBrowser.waitForDisplayed()
        //Wait for the installation to take a max of 3 mins.
        await (await this.installingTitle).chromeBrowser.waitForDisplayed({reverse:true, timeout:180000})
    }
}

export default new InstallerWelcomePage()
