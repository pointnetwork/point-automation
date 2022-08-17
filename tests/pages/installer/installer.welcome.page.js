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
        let timeout = 30
        let finished = false

        while(!finished && timeout > 0) {
            try {
                if(await (await this.installingTitle).chromeBrowser.isExisting()) {
                    timeout -= 1;
                    await browser.pause(10000);
                }else{
                    finished = true;
                }
            }catch(exception) {
                await browser.chromeBrowser.reloadSession();
            }
        }
    }
}

export default new InstallerWelcomePage()
