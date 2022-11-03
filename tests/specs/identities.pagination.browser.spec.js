import DashboardPage from '../pages/dashboard.page'
import CommonSteps from "../utilities/common.steps";
import BashProcesses from "../utilities/bash.processes";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserIdentitiesPage from "../pages/browser/browser.identities.page";

describe('Identities', function () {
    this.retries(1)
    after(async() => {
        await BashProcesses.killAllFirefoxProcesses();
        await BashProcesses.killAllPointProcesses();
    })
    it('Validate pagination on Identities tab', async () => {
        //Login
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

        //Enter to Identities
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnIdentities()
        const browserIdentitiesPage = await new BrowserIdentitiesPage(firefox)

        //Validate table
        await browserIdentitiesPage.waitForPageToBeLoaded();
        expect(browserIdentitiesPage.title).toBeDisplayed("Title is not displayed")
        expect(browserIdentitiesPage.totalLabel).toBeDisplayed("Total is not displayed")
        expect(browserIdentitiesPage.handleColumnTable).toBeDisplayed("Handle column in table is not displayed")
        expect(browserIdentitiesPage.ownerColumnTable).toBeDisplayed("Handle column in table is not displayed")
        expect(browserIdentitiesPage.appColumnTable).toBeDisplayed("Handle column in table is not displayed")
        await browserIdentitiesPage.waitForListToHaveElements(await browserIdentitiesPage.allRows)
        expect(await browserIdentitiesPage.allRows.length).toBeGreaterThan(0)

        //Get current rows
        const allRows = await browserIdentitiesPage.allRows.length

        //Scroll down
        await browserIdentitiesPage.rowToScroll.scrollIntoView();
        await browserIdentitiesPage.waitForSpinnerNotDisplayed(firefox)
        await browserIdentitiesPage.waitForListToHaveElements(await browserIdentitiesPage.allRows)
        await browserIdentitiesPage.waitForListToBeGreaterThan(await browserIdentitiesPage.allRows, allRows)

        //Validate current rows displayed
        expect(await browserIdentitiesPage.allRows.length).toBeGreaterThan(allRows)
    });
});
