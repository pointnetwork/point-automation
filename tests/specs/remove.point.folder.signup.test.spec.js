import Utils from "../utilities/utils";
import InstallerTermsConditionsPage from '../pages/installer/installer.terms.conditions.page'
import BashProcesses from "../utilities/bash.processes";
import LoginPage from "../pages/login.page";
import DashboardPage from "../pages/dashboard.page";
import LoginNewAccountPage from "../pages/login.new.account.page";
import InstallerWelcomePage from '../pages/installer/installer.welcome.page'


describe('Open/Close Browser', () => {
    it('Remove .point folder, cancel terms and conditions, accept terms and conditions and signup', async () => {
        let attempts = 3;

        while(attempts > 0) {
            await BashProcesses.killPoint();
            Utils.rmDirIfExists(await Utils.getPointFolderPath());
            await browser.reloadSession();

            //Open dashboard and browser
            await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
            await InstallerTermsConditionsPage.clickOnCancelButton();
            await browser.chromeBrowser.reloadSession();
            await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
            await InstallerTermsConditionsPage.clickOnUnderstandAndAgreeButton();
            await InstallerWelcomePage.waitForInstallerToBeDisplayed();
            await InstallerWelcomePage.clickOnStartInstallationButton();
            await InstallerWelcomePage.waitForInstallationCompleted();

            await LoginPage.waitForPageToBeLoaded();
            expect(LoginPage.noGenerateOneButton.chromeBrowser).toBeDisplayed();

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
