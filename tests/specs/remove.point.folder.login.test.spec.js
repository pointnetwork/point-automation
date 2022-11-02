import Utils from "../utilities/utils";
import InstallerTermsConditionsPage from '../pages/installer/installer.terms.conditions.page'
import BashProcesses from "../utilities/bash.processes";
import LoginPage from "../pages/login.page";
import CommonSteps from "../utilities/common.steps";
import DashboardPage from "../pages/dashboard.page";
import InstallerWelcomePage from "../pages/installer/installer.welcome.page";

describe('Remove Point Folder', () => {
    it('Remove .point folder, cancel terms and conditions, accept terms and conditions and login', async () => {
        let attempts = 3;

        while(attempts > 0) {
            //Remove .point folder and reload session
            await BashProcesses.killAllPointProcesses();
            await BashProcesses.killAllFirefoxProcesses();
            await browser.pause(3000)
            Utils.rmDirIfExists(await Utils.getPointFolderPath());
            await browser.pause(3000)
            await browser.reloadSession();

            //Cancel installation and reload session
            await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
            await InstallerTermsConditionsPage.clickOnCancelButton();
            await browser.reloadSession();

            //Continue installation
            await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
            await InstallerTermsConditionsPage.clickOnUnderstandAndAgreeButton();
            await InstallerWelcomePage.waitForInstallerToBeDisplayed();
            await InstallerWelcomePage.clickOnStartInstallationButton();
            await InstallerWelcomePage.waitForInstallationCompleted();
            await LoginPage.waitForPageToBeLoaded();
            expect(await LoginPage.noGenerateOneButton).toBeDisplayed();

            //Login
            await CommonSteps.loginUser();
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();

            //Kill firefox and check process is stopped
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            await BashProcesses.killAllFirefoxProcesses();
            await DashboardPage.launchPointBrowserButton.waitForDisplayed();
            expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();
            attempts -= 1;
            await console.log("Times to run : " + attempts);
        }
    });
});
