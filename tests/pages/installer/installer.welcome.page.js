import Page from '../page'
import BashProcesses from "../../utilities/bash.processes";

class InstallerWelcomePage extends Page {
    get startInstallationButton() {
        return $('//button[@id=\'installer:app:startInstallationButton\']')
    }

    get installingTitle() {
        return $("//*[text() = 'Installing']")
    }

    get retryInstallationButton() {
        return $("button[id='installer:app:restartInstallationButton']")
    }

    async waitForInstallerToBeDisplayed() {
        await (await this.startInstallationButton).chromeBrowser.waitForDisplayed()
    }

    async clickOnStartInstallationButton() {
        await super.clickElement((await this.startInstallationButton).chromeBrowser)
        await console.log("Clicked on 'Start Installation' button")
    }

    async waitForInstaller() {
        await console.log("Installation in progress...");
        let timeout = 40
        let finished = false

        while(!finished && timeout > 0) {
            await console.log("Checking Installation...")
            try {
                const element = await browser.chromeBrowser.$("//*[text() = 'Installing']");
                await element.waitForDisplayed({timeout:6000})
                if (await (await this.retryInstallationButton).chromeBrowser.isDisplayed()) {
                    await console.log("Installation has failed. Retrying")
                    await super.clickElement((await this.retryInstallationButton).chromeBrowser)
                }
                timeout -= 1;
                await browser.pause(10000);
                await console.log("Still Installing...")
            }catch(exception) {
                await console.log("Installation completed. Switching Window")
                finished = true
            }
        }
    }

    async waitForInstallationCompleted() {
        await (await this.installingTitle).chromeBrowser.waitForDisplayed()
        await this.waitForInstaller();
        await super.changeToActiveWindow()
    }
}

export default new InstallerWelcomePage()
