import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import CommonSteps from "../utilities/common.steps";

describe('Open/Close Browser', () => {
    it('Open dashboard and close Firefox 5 times', async () => {
        let attempts = 5;

        while(attempts > 0) {
            await CommonSteps.loginIfUserIsLoggedOut()

            //Open dashboard and browser
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            expect(DashboardPage.pointDashboardTitle).toHaveText('Point Dashboard');
            expect(DashboardPage.pointDashboardVersion).toBeDisplayed();

            //Kill firefox and check process is stopped
            await BashProcesses.killAllFirefoxProcesses();
            await DashboardPage.waitForProcessesRunning(1);
            await (await DashboardPage.launchPointBrowserButton).chromeBrowser.waitForDisplayed();
            expect((await DashboardPage.launchPointBrowserButton).chromeBrowser).toBeDisplayed();
            await DashboardPage.clickOnLogout()
            await DashboardPage.confirmLogout();

            attempts -= 1;
            await console.log("Times to run : " + attempts);
        }
    });
});

