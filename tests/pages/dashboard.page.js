import Page from './page'

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

    async waitForDashboardDisplayed() {
        await (await this.pointDashboardTitle).chromeBrowser.waitForDisplayed();
    }

    async clickOnLaunchPointBrowser() {
        await super.clickElement(this.launchPointBrowserButton);
    }

    async waitForProcessesRunning() {
        try {
            await (await this.loadingMessage).chromeBrowser.waitForDisplayed({timeout: 5000});
            await (await this.loadingMessage).chromeBrowser.waitForDisplayed({reverse:true, timeout: 120000})
        }catch(exception){
            await console.log("Loading message is not displayed");
        }

        let allProcessesWorking = false;
        let timeout = 30;

        while(!allProcessesWorking && timeout > 0) {
            if(await this.processesSuccessStatus.length === 3) {
                allProcessesWorking = true;
            }else{
                timeout -= 1;
                await browser.pause(2000);
            }
        }

        await browser.pause(2000);
        await (await this.updatingMessage).chromeBrowser.waitForDisplayed({reverse:true, timeout: 120000})
    }

    async clickOnLogout() {
        await super.clickElement((await this.logoutIcon).chromeBrowser);
    }

    async confirmLogout() {
        await super.clickElement((await this.confirmLogoutButton).chromeBrowser);
    }

    async clickOnSettingsButton() {
        await super.clickElement((await this.settingsButton).chromeBrowser);
    }

    async clickOnUninstallButton() {
        await super.clickElement((await this.uninstallButton).chromeBrowser);
    }
}

export default new DashboardPage()
