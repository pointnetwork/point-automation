import DashboardPage from '../pages/dashboard.page'
import LoginPage from '../pages/login.page'
import LoginNewAccountPage from '../pages/login.new.account.page';
import BrowserFinalStepSignupPage from '../pages/browser/browser.final.step.signup.page';
import BrowserHomePage from '../pages/browser/browser.home.page';
import Utils from '../utilities/utils';

import CommonSteps from "../utilities/common.steps";
import CommonValidations from "../utilities/common.validations";

describe('Open/Close Browser', () => {
    it('Create new identity', async () => {
        await CommonSteps.loginIfUserIsLoggedOut();
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        //Logout user
        await DashboardPage.clickOnLogout();
        await DashboardPage.confirmLogout();
        await LoginPage.waitForPageToBeLoaded();
        expect(LoginPage.noGenerateOneButton.browserChrome).toBeDisplayed();

        //Generate new keys
        await LoginPage.clickOnNoGenerateOne();
        await LoginNewAccountPage.clickOnGenerate();
        const words = await LoginNewAccountPage.getSecretWords();
        await LoginNewAccountPage.clickOnContinue();
        await LoginNewAccountPage.enterThreeFirstWords(words[0], words[2], words[11]);
        await LoginNewAccountPage.clickOnConfirmAndLoginButton();

        //Open firefox and create new identity
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();
        await CommonSteps.openPointInNewFirefox();
        await BrowserFinalStepSignupPage.waitForPageToBeLoaded();
        await BrowserFinalStepSignupPage.enterUsername(Utils.getRandomString() + Utils.getRandomNumber())
        await BrowserFinalStepSignupPage.clickOnRegisterButton();
        await BrowserFinalStepSignupPage.clickOnSureButton();
        await BrowserHomePage.waitForPageToBeLoaded();
        await CommonValidations.isFirefoxPageDisplayed();
    });
});
