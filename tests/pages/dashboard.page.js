import Page from './page'
import BashProcesses from "../utilities/bash.processes";
import Utils from "../utilities/utils";

class DashboardPage extends Page {
    get pointDashboardTitle() {
        return $('//div//h1')
    }

    get launchPointBrowserButton() {
        return $("//p[text() = 'Resources']/../div[2]//span[text() = 'Launch']")
    }

    get pointDashboardVersion() {
        return $("//h1/..//span")
    }

    get processesSuccessStatus() {
        return $$("//*[@data-testid = 'CircleIcon'][contains(@class, 'colorSuccess')]")
    }

    get loadingMessage() {
        return $("//*[@role='dialog']")
    }

    get checkingForUpdatesLabel() {
        return $("//*[contains(text(), 'Checking for updates...')]")
    }

    get logoutIcon() {
        return $("//*[@data-testid='LogoutIcon']/ancestor::button")
    }

    get confirmLogoutButton() {
        return $("//button[text() = 'Log Out']")
    }

    get updatingMessage() {
        return $("//*[contains(text(), 'Updating')]")
    }

    get settingsButton() {
        return $("//*[@data-testid='SettingsIcon']/ancestor::button")
    }

    get uninstallButton() {
        return $("//*[@data-testid='CancelPresentationIcon']/ancestor::ul")
    }

    get tryingToConnectPointEngineLabel() {
        return $("//*[contains(text(), 'Trying to connect to Point Engine')]")
    }

    async waitForDashboardDisplayed() {
        await this.pointDashboardTitle.waitForDisplayed();
    }

    async clickOnLaunchPointBrowser() {
        await super.clickElement(this.launchPointBrowserButton);
    }

    async waitForProcessesRunning(processes=3) {
        try {
            await this.loadingMessage.waitForDisplayed({timeout: 5000});
            await this.loadingMessage.waitForDisplayed({reverse:true, timeout: 5000})
            await console.log("App loaded successfully");
        }catch(exception){
            await console.log("Loading message is not displayed");
        }

        let allProcessesWorking = false;
        let timeout = 10;
        let processesLength;

        while(!allProcessesWorking && timeout > 0) {
            processesLength = await this.processesSuccessStatus.length;

            if(processesLength === processes) {
                allProcessesWorking = true;
            }else{
                timeout -= 1;
                await browser.pause(2000);
            }
        }
        await browser.pause(2000);
        // await console.log("Printing processes")
        // await BashProcesses.getPointProcesses()
        await console.log("Checking Trying to connect to Point engine message...")
        await this.tryingToConnectPointEngineLabel.waitForDisplayed({reverse:true, timeout: 120000})
        await console.log("Trying to connect to point engine message is not displayed")
        await this.updatingMessage.waitForDisplayed({reverse:true, timeout: 240000})
        await console.log("Updating message is not displayed")
    }

    async clickOnLogout() {
        await browser.pause(10000);
        await super.clickElement(await this.logoutIcon);
    }

    async confirmLogout() {
        await browser.pause(2000);
        await super.clickElement(await this.confirmLogoutButton);
        await console.log("User is logged out");
        try {
            await this.confirmLogoutButton.waitForDisplayed({reverse:true, timeout:60000})
        }catch(exception) {
            await console.log("User is still logged in. Error : "+ exception)
        }
        await Utils.reloadSessionLinux()
        await super.changeToActiveWindow();
    }

    async clickOnSettingsButton() {
        await super.clickElement(await this.settingsButton);
    }

    async clickOnUninstallButton() {
        await super.clickElement(await this.uninstallButton);
    }
}

export default new DashboardPage()
