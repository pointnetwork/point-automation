import DashboardPage from '../pages/dashboard.page'
import BashProcesses from '../utilities/bash.processes'
import CommonSteps from "../utilities/common.steps";

describe('Open/Close Browser', () => {
    it('Open and close dashboard 5 times', async () => {
        let attempts = 5;
        await CommonSteps.loginIfUserIsLoggedOut();

        while(attempts > 0) {
            //Open dashboard and browser
            await DashboardPage.waitForDashboardDisplayed();
            await DashboardPage.waitForProcessesRunning();
            expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
            expect(DashboardPage.pointDashboardTitle).toHaveText('Point Dashboard');
            expect(DashboardPage.pointDashboardVersion).toBeDisplayed();

            attempts -= 1;
            await browser.chromeBrowser.reloadSession();
            await console.log("Times to run : " + attempts);
        }
    });
});
