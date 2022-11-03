import DashboardPage from '../pages/dashboard.page'

import CommonSteps from "../utilities/common.steps";
import BashProcesses from "../utilities/bash.processes";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserAppsPage from "../pages/browser/browser.apps.page";
import BrowserIdentityPage from "../pages/browser/browser.identity.page";
let browserTopBarPage
let browserAppsPage
let browserIdentityPage
let firefox

describe('Apps tab', function () {
    this.retries(1)

    after(async() => {
        await BashProcesses.killAllFirefoxProcesses();
        await BashProcesses.killAllPointProcesses();
    })
    it('Validate pagination in Apps page and information in Table', async () => {
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

        //Create firefox instance
        firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);

        //Enter to Apps
        browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnApps()
        browserAppsPage = await new BrowserAppsPage(firefox)
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
    })
    it('Allows user to click on Handle', async () => {
        //Click on Handle
        await browserAppsPage.clickOnHandleByIndex(0)
        browserIdentityPage = await new BrowserIdentityPage(firefox)
        await browserIdentityPage.waitForPageToBeLoaded()

        //Assertions on identity page
        expect(browserIdentityPage.title).toBeDisplayed("Title is not displayed")
        expect(browserIdentityPage.handleValue).toBeDisplayed("Handle is not displayed")
        expect(browserIdentityPage.ownerValue).toBeDisplayed("Owner is not displayed")
        expect(browserIdentityPage.communicationPublicKeyValue).toBeDisplayed("Communication Public Key is not displayed")
        expect(browserIdentityPage.domainSpaceValue).toBeDisplayed("Domain space is not displayed")
    })
    it('Allows user to click on App', async () => {
        await browserTopBarPage.clickOnApps()
        await browserAppsPage.waitForPageToBeLoaded();
        const url = (await browserAppsPage.getAppOnRowByIndex(0)).getUrl();
        await browserAppsPage.clickOnAppByIndex(0);

        expect(browser.getUrl()).toEqual(url);
    });
});
