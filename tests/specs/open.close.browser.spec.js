import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import CommonSteps from "../utilities/common.steps";
import InstallerTermsConditionsPage from "../pages/installer/installer.terms.conditions.page";
import InstallerWelcomePage from "../pages/installer/installer.welcome.page";
import LoginPage from "../pages/login.page";

describe('Open/Close Browser', () => {
    it('Open dashboard and close Firefox 5 times', async () => {
        let attempts = 1;

        await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
        await InstallerTermsConditionsPage.clickOnUnderstandAndAgreeButton();
        await InstallerWelcomePage.waitForInstallerToBeDisplayed();
        await InstallerWelcomePage.clickOnStartInstallationButton();
        await InstallerWelcomePage.waitForInstallationCompleted();

        await LoginPage.waitForPageToBeLoaded();
        expect(LoginPage.noGenerateOneButton.chromeBrowser).toBeDisplayed();

        //Login
        await CommonSteps.loginUser();

        while(attempts > 0) {
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
            attempts -= 1;
            await browser.pause(10000);
            await browser.reloadSession();
        }
    });
});
