import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import CommonSteps from "../utilities/common.steps";
import InstallerTermsConditionsPage from "../pages/installer/installer.terms.conditions.page";
import InstallerWelcomePage from "../pages/installer/installer.welcome.page";
import LoginPage from "../pages/login.page";

describe('Open/Close Browser', () => {
    it('Open dashboard and close Firefox 5 times', async () => {
        let attempts = 5;
/*

        await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
        await InstallerTermsConditionsPage.clickOnUnderstandAndAgreeButton();
        await InstallerWelcomePage.waitForInstallerToBeDisplayed();
        await InstallerWelcomePage.clickOnStartInstallationButton();
        await InstallerWelcomePage.waitForInstallationCompleted();

        await LoginPage.waitForPageToBeLoaded();
        expect(LoginPage.noGenerateOneButton.chromeBrowser).toBeDisplayed();
*/

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
            await BashProcesses.killFirefox();
            await (await DashboardPage.launchPointBrowserButton).chromeBrowser.waitForDisplayed();
            expect((await DashboardPage.launchPointBrowserButton).chromeBrowser).toBeDisplayed();
            await DashboardPage.clickOnLogout()
            await DashboardPage.confirmLogout();
            await browser.pause(5000);
            attempts -= 1;
            await console.log("Times to run : " + attempts);
        }
    });
});
