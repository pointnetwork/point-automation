import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import LoginPage from '../pages/login.page'
import LoginNewAccountPage from '../pages/login.new.account.page';
import CommonSteps from "../utilities/common.steps";

describe('Open/Close Browser', () => {
    it('Open dashboard, Logout, generate a new key not closing browser 3 times.', async () => {
        let attempts = 3;
        await CommonSteps.loginIfUserIsLoggedOut();

        while(attempts > 0) {
            //Logout
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            expect(DashboardPage.pointDashboardTitle).toHaveText('Point Dashboard');
            expect(DashboardPage.pointDashboardVersion).toBeDisplayed();

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
            attempts -= 1;
            await console.log("Times to run : " + attempts);
        }
    });
});
