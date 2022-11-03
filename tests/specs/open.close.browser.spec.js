import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import CommonSteps from "../utilities/common.steps";
import LoginPage from "../pages/login.page";

describe('Open/Close Browser', function () {
    this.retries(1)
    after(async() => {
        await BashProcesses.killAllPointProcesses();
    })
    it('Open dashboard and close Firefox 5 times', async () => {
        let attempts = 5;

        while(attempts > 0) {
            //Login
            await CommonSteps.loginUser();

            //Open dashboard and browser
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            expect(DashboardPage.pointDashboardTitle).toHaveText('Point Dashboard');
            expect(DashboardPage.pointDashboardVersion).toBeDisplayed();

            //Kill firefox and check process is stopped
            await BashProcesses.killAllFirefoxProcesses();
            await DashboardPage.waitForProcessesRunning(1);
            await DashboardPage.launchPointBrowserButton.waitForDisplayed();
            expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();

            //Logout
            await DashboardPage.clickOnLogout()
            await DashboardPage.confirmLogout();
            await LoginPage.waitForPageToBeLoaded();
            expect(await LoginPage.noGenerateOneButton).toBeDisplayed();

            attempts -= 1;
            await console.log("Times to run : " + attempts);
        }
    });
});

