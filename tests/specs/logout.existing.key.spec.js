import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import LoginPage from '../pages/login.page'
import LoginNewAccountPage from '../pages/login.new.account.page';
import CommonSteps from "../utilities/common.steps";

describe('Open/Close Browser', () => {
    it('Open dashboard, Logout, import existing key and close browser 3 times.', async () => {
        let attempts = 1;
        await CommonSteps.loginIfUserIsLoggedOut();
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        while(attempts > 0) {
            //Logout
            await DashboardPage.clickOnLogout();
            await DashboardPage.confirmLogout();
            await LoginPage.waitForPageToBeLoaded();
            expect(LoginPage.noGenerateOneButton.chromeBrowser).toBeDisplayed();

            //Generate new keys
            await CommonSteps.loginUser();

            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();

            //Kill firefox and check process is stopped
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            await BashProcesses.killFirefox();
            await (await DashboardPage.launchPointBrowserButton).chromeBrowser.waitForDisplayed();
            expect(DashboardPage.launchPointBrowserButton.chromeBrowser).toBeDisplayed();
            attempts -= 1;
        }
    });
});
