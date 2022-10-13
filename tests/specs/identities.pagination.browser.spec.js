import DashboardPage from '../pages/dashboard.page'
import LoginPage from '../pages/login.page'
import LoginNewAccountPage from '../pages/login.new.account.page';
import BrowserFinalStepSignupPage from '../pages/browser/browser.final.step.signup.page';
import BrowserHomePage from '../pages/browser/browser.home.page';
import Utils from '../utilities/utils';

import CommonSteps from "../utilities/common.steps";
import CommonValidations from "../utilities/common.validations";
import BashProcesses from "../utilities/bash.processes";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserIdentitiesPage from "../pages/browser/browser.identities.page";

describe('Open/Close Browser', () => {
    it('Validate pagination on Identities tab', async () => {
        await CommonSteps.loginIfUserIsLoggedOut();
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        //Open firefox and create new identity
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.changeToActiveWindow();
        await DashboardPage.waitForProcessesRunning();
        await BashProcesses.killAllFirefoxProcesses();
        await DashboardPage.waitForProcessesRunning(1);
        await browser.pause(10000)
        await DashboardPage.launchPointBrowserButton.waitForDisplayed();
        expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();

        const firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnIdentities()
        const browserIdentitiesPage = await new BrowserIdentitiesPage(firefox)

        await browserIdentitiesPage.waitForPageToBeLoaded();
        expect(browserIdentitiesPage.title).toBeDisplayed("Title is not displayed")
        expect(browserIdentitiesPage.totalLabel).toBeDisplayed("Total is not displayed")
        expect(browserIdentitiesPage.handleColumnTable).toBeDisplayed("Handle column in table is not displayed")
        expect(browserIdentitiesPage.ownerColumnTable).toBeDisplayed("Handle column in table is not displayed")
        expect(browserIdentitiesPage.appColumnTable).toBeDisplayed("Handle column in table is not displayed")
        await browserIdentitiesPage.waitForListToHaveElements(await browserIdentitiesPage.allRows)
        await browser.pause(2000)
        expect(await browserIdentitiesPage.allRows.length).toBeGreaterThan(0)

        const allRows = await browserIdentitiesPage.allRows.length

        await browser.executeScript("", "window.scrollBy(0,1000)")
        await browserIdentitiesPage.loadingSpinner.waitForDisplayed()
        await browserIdentitiesPage.loadingSpinner.waitForDisplayed({reverse:true})

        expect(await browserIdentitiesPage.allRows.length).toBeGreaterThan(allRows)
    });
});
