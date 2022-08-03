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
        return $("//*[contains(text(), 'Starting')]")
    }

    get checkingForUpdatesLabel() {
        return $("//*[contains(text(), 'Checking for updates...')]")
    }
que
    async waitForDashboardDisplayed() {
        await this.pointDashboardTitle.waitForDisplayed();
    }

    async clickOnLaunchPointBrowser() {
        await super.clickElement(this.launchPointBrowserButton);
    }

    async waitForProcessesRunning() {
        await this.loadingMessage.waitForDisplayed();
        await this.loadingMessage.waitForDisplayed({reverse:true, timeout: 120000})
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
    }
}

export default new DashboardPage()
