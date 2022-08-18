import Page from '../page'
import BashProcesses from "../../utilities/bash.processes";

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
                const element = await browser.chromeBrowser.$("//*[text() = 'Installing']");
                await element.waitForDisplayed({timeout:5000})
                timeout -= 1;
                await browser.pause(10000);
            }catch(exception) {
                finished = true
                await BashProcesses.killPoint();
                await browser.chromeBrowser.reloadSession();
            }
        }
    }
}

export default new InstallerWelcomePage()
