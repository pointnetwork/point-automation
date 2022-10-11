import DashboardPage from '../pages/dashboard.page'
import BrowserHomePage from '../pages/browser/browser.home.page'
import CommonSteps from "../utilities/common.steps";
import CommonValidations from "../utilities/common.validations";
import BashProcesses from "../utilities/bash.processes";

describe('Open/Close Browser', () => {
    it('Open point and verify browser', async () => {
        await CommonSteps.loginIfUserIsLoggedOut();

        //Open dashboard and browser
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();
        expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
        await DashboardPage.waitForProcessesRunning();
        await BashProcesses.killAllFirefoxProcesses();
        await DashboardPage.waitForProcessesRunning(1);
        await browser.pause(10000)
        await DashboardPage.launchPointBrowserButton.waitForDisplayed();
        expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();

        const firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);
        const browserHome = await new BrowserHomePage(firefox)
        await browserHome.waitForPageToBeLoaded();
        await CommonValidations.isFirefoxPageDisplayed(browserHome);
    });
});
