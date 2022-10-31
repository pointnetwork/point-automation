import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import LoginPage from '../pages/login.page'
import LoginNewAccountPage from '../pages/login.new.account.page';
import CommonSteps from "../utilities/common.steps";
import Utils from "../utilities/utils";

describe('Logout with an existing key', () => {
    it('Open dashboard, Logout, import existing key and close browser 3 times.', async () => {
        let attempts = 3;
        let processesToWait = 3;
        await CommonSteps.loginIfUserIsLoggedOut();

        while(attempts > 0) {
            //Validate Point is opened
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning(processesToWait);
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            expect(DashboardPage.pointDashboardTitle).toHaveText('Point Dashboard');
            expect(DashboardPage.pointDashboardVersion).toBeDisplayed();

            //Logout
            await BashProcesses.killAllFirefoxProcesses();
            await DashboardPage.waitForProcessesRunning(1);
            await DashboardPage.clickOnLogout();
            await DashboardPage.confirmLogout();
            await LoginPage.waitForPageToBeLoaded();
            expect(await LoginPage.noGenerateOneButton).toBeDisplayed();

            //Login
            await CommonSteps.loginUser();
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();

            //Kill firefox and check process is stopped
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            await BashProcesses.killAllFirefoxProcesses();
            await DashboardPage.waitForProcessesRunning(1);
            await DashboardPage.launchPointBrowserButton.waitForDisplayed();
            expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();

            attempts -= 1;
            processesToWait = 1;
            await console.log("Times to run : " + attempts);
        }
    });
});
