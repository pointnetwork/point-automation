import DashboardPage from '../pages/dashboard.page'

import CommonSteps from "../utilities/common.steps";
import BashProcesses from "../utilities/bash.processes";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserIdentityPage from "../pages/browser/browser.identity.page";
import {faker} from "@faker-js/faker";
import BrowserTransactionModalPage from "../pages/browser/browser.transaction.modal.page";
import Credentials from "../resources/decryptedcredentials.json";

describe('Identity / Deployer', () => {
    it('Validate a Deployer can be added correctly', async () => {
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
        const firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);

        //Enter to personal identity
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnIdentityButton()
        const browserIdentityPage = await new BrowserIdentityPage(firefox)
        await browserIdentityPage.waitForPageToBeLoaded()

        //Revoke deployer
        const expectedStatus = await browserIdentityPage.revokeDeployerIfDisplayed()
        const browserTransactionModalPage = await new BrowserTransactionModalPage(firefox)

        //Add new deployer
        const address = Credentials.accountSecondUser
        await browserIdentityPage.addNewDeployer(address)
        await browserIdentityPage.switchToTab("Point Confirmation Window", firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserTransactionModalPage.switchToTab("Point Explorer", firefox)
        await browserTransactionModalPage.waitForSpinnerNotDisplayed(firefox)
        expect(await browserIdentityPage.successDeployerAddedMessage).toBeDisplayed()
        expect(await browserIdentityPage.successDeployerOkButton).toBeDisplayed()
        await browserIdentityPage.clickOnDeployerAddedOkButton()

        await firefox.refresh()
        await browserIdentityPage.waitForPageToBeLoaded()
        await browserIdentityPage.deployersTable.waitForDisplayed()
        await browserIdentityPage.moveToFirstDeployer()

        //Assertions on Deployers table
        expect(await browserIdentityPage.getDeployerNameByRowIndex(1)).toHaveText("@alexistesttwo")
        expect(await browserIdentityPage.getDeployerAddressByRowIndex(1)).toHaveText(address)
        expect(await browserIdentityPage.getDeployerStatusByRowIndex(1)).toHaveText(expectedStatus)
        expect(await browserIdentityPage.getDeployerDateByRowIndex(1)).toBeDisplayed()

        //Reactivate
        await browserIdentityPage.clickOnReactivateButtonByIndexIfNeeded(expectedStatus, 1)

        await firefox.refresh()
        await browserIdentityPage.waitForPageToBeLoaded()
        await browserIdentityPage.deployersTable.waitForDisplayed()
        await browserIdentityPage.moveToFirstDeployer()

        expect(await browserIdentityPage.getDeployerNameByRowIndex(1)).toHaveText("@alexistesttwo")
        expect(await browserIdentityPage.getDeployerAddressByRowIndex(1)).toHaveText(address)
        expect(await browserIdentityPage.getDeployerStatusByRowIndex(1)).toHaveText("Allowed")
        expect(await browserIdentityPage.getDeployerDateByRowIndex(1)).toBeDisplayed()
        expect(await browserIdentityPage.getDeployerReactiveButtonByRowIndex(1)).toHaveText("Revoke")
    });
});
