import DashboardPage from '../pages/dashboard.page'

import CommonSteps from "../utilities/common.steps";
import BashProcesses from "../utilities/bash.processes";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserIdentityPage from "../pages/browser/browser.identity.page";
import BrowserTransactionModalPage from "../pages/browser/browser.transaction.modal.page";
import Credentials from "../resources/decryptedcredentials.json";
let firefox
let browserIdentityPage
let browserTransactionModalPage
let expectedStatus
let address

describe('Identity / Deployer', function () {
    this.retries(1)
    after(function () {
        BashProcesses.killAllFirefoxProcesses();
        BashProcesses.killAllPointProcesses();
    })
    it('Allows to revoke a deployer', async () => {
        //Login
        await CommonSteps.loginIfUserIsLoggedOut();
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        //Kill firefox
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.changeToActiveWindow();
        await DashboardPage.waitForProcessesRunning();
        await BashProcesses.killAllFirefoxProcesses();
        await DashboardPage.waitForProcessesRunning(1);
        await browser.pause(10000)
        await DashboardPage.launchPointBrowserButton.waitForDisplayed();
        expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();

        //Open firefox instance
        firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);

        //Enter to personal identity
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnIdentityButton()
        browserIdentityPage = await new BrowserIdentityPage(firefox)
        await browserIdentityPage.waitForPageToBeLoaded()

        //Revoke deployer
        expectedStatus = await browserIdentityPage.revokeDeployerIfDisplayed()
        browserTransactionModalPage = await new BrowserTransactionModalPage(firefox)
        expect(await browserIdentityPage.getDeployerStatusByRowIndex(1)).toHaveText("Revoked")
    })
    it('Allows to add a new deployer', async () => {
        //Add new deployer
        address = Credentials.accountSecondUser
        await browserIdentityPage.addNewDeployer(address)
        await browserIdentityPage.switchToTab("Point Confirmation Window", firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserTransactionModalPage.switchToTab("Point Explorer", firefox)
        await browserTransactionModalPage.waitForSpinnerNotDisplayed(firefox)
        expect(await browserIdentityPage.successDeployerAddedMessage).toBeDisplayed()
        expect(await browserIdentityPage.successDeployerOkButton).toBeDisplayed()
        await browserIdentityPage.clickOnDeployerAddedOkButton()

        //Refresh page to see the changes
        await firefox.refresh()
        await browserIdentityPage.waitForPageToBeLoaded()
        await browserIdentityPage.moveToFirstDeployer()

        //Assertions on Deployers table
        expect(await browserIdentityPage.getDeployerNameByRowIndex(1)).toHaveText("@alexistesttwo")
        expect(await browserIdentityPage.getDeployerAddressByRowIndex(1)).toHaveText(address)
        expect(await browserIdentityPage.getDeployerStatusByRowIndex(1)).toHaveText(expectedStatus)
        expect(await browserIdentityPage.getDeployerDateByRowIndex(1)).toBeDisplayed()
    })
    it('Allows to reactivate a deployer', async () => {
        //Reactivate
        await browserIdentityPage.clickOnReactivateButtonByIndexIfNeeded(expectedStatus, 1)

        //Refresh page to see the changes
        await firefox.refresh()
        await browserIdentityPage.waitForPageToBeLoaded()
        await browserIdentityPage.deployersTable.waitForDisplayed()
        await browserIdentityPage.moveToFirstDeployer()

        //Assertions on Deployers table
        expect(await browserIdentityPage.getDeployerNameByRowIndex(1)).toHaveText("@alexistesttwo")
        expect(await browserIdentityPage.getDeployerAddressByRowIndex(1)).toHaveText(address)
        expect(await browserIdentityPage.getDeployerStatusByRowIndex(1)).toHaveText("Allowed")
        expect(await browserIdentityPage.getDeployerDateByRowIndex(1)).toBeDisplayed()
        expect(await browserIdentityPage.getDeployerReactiveButtonByRowIndex(1)).toHaveText("Revoke")
    });
});
