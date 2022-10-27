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
import BrowserAppsPage from "../pages/browser/browser.apps.page";
import BrowserIdentityPage from "../pages/browser/browser.identity.page";

describe('Identities', () => {
    afterEach(async() => {
        await BashProcesses.killAllFirefoxProcesses();
    })
    it('Validate pagination on Apps tab', async () => {
        await CommonSteps.loginIfUserIsLoggedOut();
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        //Open firefox
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

        //Enter to Apps
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnApps()
        const browserAppsPage = await new BrowserAppsPage(firefox)
        await browserAppsPage.waitForPageToBeLoaded();

        //Assertions on Apps Table
        expect(browserAppsPage.title).toBeDisplayed("Title is not displayed")
        expect(browserAppsPage.totalLabel).toBeDisplayed("Total is not displayed")
        expect(browserAppsPage.handleColumnTable).toBeDisplayed("Handle column in table is not displayed")
        expect(browserAppsPage.ownerColumnTable).toBeDisplayed("Handle column in table is not displayed")
        expect(browserAppsPage.appColumnTable).toBeDisplayed("Handle column in table is not displayed")
        await browserAppsPage.waitForListToHaveElements(await browserAppsPage.allRows)
        expect(await browserAppsPage.allRows.length).toBeGreaterThan(0)

        //Assertion on pagination
        const allRows = await browserAppsPage.allRows.length
        await browserAppsPage.rowToScroll.scrollIntoView();
        await browserAppsPage.waitForSpinnerNotDisplayed(firefox)
        await browserAppsPage.waitForListToHaveElements(await browserAppsPage.allRows)
        await browserAppsPage.waitForListToBeGreaterThan(await browserAppsPage.allRows, allRows)
        expect(await browserAppsPage.allRows.length).toBeGreaterThan(allRows)

        await browserAppsPage.firstRowToScroll.scrollIntoView();

        //Click on Handle
        await browserAppsPage.clickOnHandleByIndex(0)
        const browserIdentityPage = await new BrowserIdentityPage(firefox)
        await browserIdentityPage.waitForPageToBeLoaded()

        //Assertions on identity page
        expect(browserIdentityPage.title).toBeDisplayed("Title is not displayed")
        expect(browserIdentityPage.handleValue).toBeDisplayed("Handle is not displayed")
        expect(browserIdentityPage.ownerValue).toBeDisplayed("Owner is not displayed")
        expect(browserIdentityPage.communicationPublicKeyValue).toBeDisplayed("Communication Public Key is not displayed")
        expect(browserIdentityPage.domainSpaceValue).toBeDisplayed("Domain space is not displayed")

        await browserTopBarPage.clickOnApps()
        await browserAppsPage.waitForPageToBeLoaded();
        const url = (await browserAppsPage.getAppOnRowByIndex(0)).getUrl();
        await browserAppsPage.clickOnAppByIndex(0);

        expect(browser.getUrl()).toEqual(url);
    });
});
