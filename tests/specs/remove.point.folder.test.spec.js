import Utils from "../utilities/utils";
import InstallerTermsConditionsPage from '../pages/installer/installer.terms.conditions.page'

describe('Open/Close Browser', () => {
    before(function () {
        Utils.rmDirIfExists(require('os').homedir() + "/.point");
        browser.reloadSession();
    });
    it('Remove .point folder, cancel terms and conditions and ok', async () => {
        //Open dashboard and browser
        await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
        await InstallerTermsConditionsPage.clickOnCancelButton();
        //toDo: Implement method to validate that Point is closed
        //toDo: Implement method to re-launch app
    });
});
