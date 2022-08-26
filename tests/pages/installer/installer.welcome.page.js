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
        await console.log("Clicked on 'Start Installation' button")
    }

    async waitForInstallationCompleted() {
        await (await this.installingTitle).chromeBrowser.waitForDisplayed()
        await console.log("Installation in progress..." + Date.now());
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
                await browser.reloadSession();
            }
        }
        await console.log("Installation completed!" + Date.now())
    }
}

export default new InstallerWelcomePage()
