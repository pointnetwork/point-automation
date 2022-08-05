import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'

describe('Open/Close Browser', () => {
    it('Open dashboard and close Firefox 5 times', async () => {
        let attempts = 5;

        while(attempts > 0) {
            //Open dashboard and browser
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            expect(DashboardPage.pointDashboardTitle).toHaveText('Point Dashboard');
            expect(DashboardPage.pointDashboardVersion).toBeDisplayed();

            //Kill firefox and check process is stopped
            await BashProcesses.killFirefox();
            await DashboardPage.launchPointBrowserButton.waitForDisplayed();
            expect(DashboardPage.launchPointBrowserButton).toBeDisplayed();
            attempts -= 1;
            await browser.reloadSession();
        }
    });
});
