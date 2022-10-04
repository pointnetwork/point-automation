import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import LoginPage from '../pages/login.page'
import LoginNewAccountPage from '../pages/login.new.account.page';
import CommonSteps from "../utilities/common.steps";

describe('Open/Close Browser', () => {
    it('Open dashboard, Logout, generate a new key and close browser 3 times.', async () => {
        let attempts = 3;
        let processesToWait = 3;
        await CommonSteps.loginIfUserIsLoggedOut();

        while(attempts > 0) {
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning(processesToWait);

            //Logout
            await DashboardPage.clickOnLogout();
            await DashboardPage.confirmLogout();
            await LoginPage.waitForPageToBeLoaded();
            expect(LoginPage.noGenerateOneButton).toBeDisplayed();

            //Generate new keys
            await LoginPage.clickOnNoGenerateOne();
            await LoginNewAccountPage.clickOnGenerate();
            const words = await LoginNewAccountPage.getSecretWords();
            await LoginNewAccountPage.clickOnContinue();
            await LoginNewAccountPage.enterThreeFirstWords(words[0], words[2], words[11]);
            await LoginNewAccountPage.clickOnConfirmAndLoginButton();
            await DashboardPage.changeToActiveWindow();

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
