import DashboardPage from '../pages/dashboard.page'
import CommonSteps from "../utilities/common.steps";
import CommonValidations from "../utilities/common.validations";

//toDo: Uninstall option is enabled just in Windows for now
describe.skip('Uninstall Point and install it again', () => {
    it('Uninstall app from Settings, and install it again', async () => {
        let attempts = 2;
        await CommonSteps.loginIfUserIsLoggedOut();
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        while(attempts > 0) {
            //Uninstall
            await DashboardPage.clickOnSettingsButton();
            await DashboardPage.clickOnUninstallButton();

            //Verify that app was uninstalled
            expect(await CommonValidations.isAppUninstalled()).toEqual(true);
        }
    });
});
