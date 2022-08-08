import Page from './page'

class DashboardPage extends Page {
    get pointDashboardTitle() {
        return $('//h1')
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

    async waitForDashboardDisplayed() {
        await this.pointDashboardTitle.waitForDisplayed();
    }

    async clickOnLaunchPointBrowser() {
        await super.clickElement(this.launchPointBrowserButton);
    }

    async waitForProcessesRunning() {
        try {
            await this.loadingMessage.waitForDisplayed({timeout: 5000});
            await this.loadingMessage.waitForDisplayed({reverse:true, timeout: 120000})
        }catch(exception){
            await console.log("Loading message is not displayed");
        }

        let allProcessesWorking = false;
        let timeout = 30;

        while(!allProcessesWorking && timeout > 0) {
            if(this.processesSuccessStatus.length === 3) {
                allProcessesWorking = true;
            }else{
                timeout -= 1;
                browser.pause(2000);
            }
        }

        await browser.pause(2000);
        await this.updatingMessage.waitForDisplayed({reverse:true, timeout: 120000})
    }

    async clickOnLogout() {
        await super.clickElement(this.logoutIcon);
    }

    async confirmLogout() {
        await super.clickElement(this.confirmLogoutButton);
    }
}

export default new DashboardPage()
