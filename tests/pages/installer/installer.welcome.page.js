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
                timeout -= 1;
                await browser.pause(10000);
                await console.log("Still Installing...")
            }catch(exception) {
                await console.log("Killing Point process and reloading session")
                finished = true
                await BashProcesses.killPoint();
                await browser.pause(5000);
                await browser.reloadSession();
                await browser.pause(5000);
            }
        }
    }

    async waitForInstallationCompleted() {
        await (await this.installingTitle).chromeBrowser.waitForDisplayed()
        await this.waitForInstaller();

        try {
            if (await this.retryInstallationButton.isDisplayed()) {
                await console.log("Installation has failed. Retrying")
                await super.clickElement(this.retryInstallationButton)
                await this.waitForInstaller();
            }
        }catch(exception) {
            await console.log("Installation completed!")
        }
    }
}

export default new InstallerWelcomePage()
