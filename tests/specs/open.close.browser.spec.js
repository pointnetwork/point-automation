import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import CommonSteps from "../utilities/common.steps";
import LoginPage from "../pages/login.page";

describe('Open/Close Browser', () => {
    it('Open dashboard and close Firefox 5 times', async () => {
        let attempts = 1;
        await CommonSteps.loginIfUserIsLoggedOut()

        while(attempts > 0) {

            //Open dashboard and browser
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            expect(DashboardPage.pointDashboardTitle).toHaveText('Point Dashboard');
            expect(DashboardPage.pointDashboardVersion).toBeDisplayed();
            //
            // //Kill firefox and check process is stopped
            // await BashProcesses.killAllFirefoxProcesses();
            // await DashboardPage.waitForProcessesRunning(1);
            // await DashboardPage.launchPointBrowserButton.waitForDisplayed();
            // expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();
            //
            // await DashboardPage.clickOnLogout()
            // await DashboardPage.confirmLogout();
            //
            // await LoginPage.waitForPageToBeLoaded();
            // expect(await LoginPage.noGenerateOneButton).toBeDisplayed();
            //
            // await CommonSteps.loginUser();
            //
            attempts -= 1;
            // await console.log("Times to run : " + attempts);
        }
    });
});

