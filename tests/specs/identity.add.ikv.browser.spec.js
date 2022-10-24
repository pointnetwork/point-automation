import DashboardPage from '../pages/dashboard.page'

import CommonSteps from "../utilities/common.steps";
import BashProcesses from "../utilities/bash.processes";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserIdentityPage from "../pages/browser/browser.identity.page";
import {faker} from "@faker-js/faker";
import BrowserTransactionModalPage from "../pages/browser/browser.transaction.modal.page";

describe('Identity / IKV', () => {
    it('Validate an IKV can be added correctly', async () => {
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

        //Assertions on personal identity page
        expect(browserIdentityPage.title).toBeDisplayed("Title is not displayed")
        expect(browserIdentityPage.handleValue).toBeDisplayed("Handle is not displayed")
        expect(browserIdentityPage.ownerValue).toBeDisplayed("Owner is not displayed")
        expect(browserIdentityPage.communicationPublicKeyValue).toBeDisplayed("Communication Public Key is not displayed")
        expect(browserIdentityPage.domainSpaceValue).toBeDisplayed("Domain space is not displayed")
        expect(browserIdentityPage.addNewEntryKeyTextbox).toBeDisplayed("New entry key textbox is not displayed")
        expect(browserIdentityPage.addNewEntryValueTextbox).toBeDisplayed("New entry Value textbox is not displayed")
        expect(browserIdentityPage.addNewEntryVersionTextbox).toBeDisplayed("New entry version textbox is not displayed")
        expect(browserIdentityPage.addNewEntryAddButton).toBeDisplayed("New entry Add button is not displayed")
        expect(browserIdentityPage.deployersAddressTextbox).toBeDisplayed("Deployers textbox is not displayed")
        expect(browserIdentityPage.addDeployerAddButton).toBeDisplayed("Deployers Add button is not displayed")
        await browserIdentityPage.waitForListToHaveElements(await browserIdentityPage.allIKVRows)
        const ikvRows = await browserIdentityPage.allIKVRows.length

        //Add a new IKV entry
        const name = faker.commerce.productName()
        const value = faker.commerce.productName()
        const version = "1.0.2"
        await browserIdentityPage.addNewEntry(name, value, version)
        await browserIdentityPage.switchToTab("Point Confirmation Window", firefox)
        const browserTransactionModalPage = await new BrowserTransactionModalPage(firefox)

        //Cancel the transaction
        await browserTransactionModalPage.clickOnCancel()
        await browserTransactionModalPage.switchToTab("Point Explorer", firefox)
        await browserIdentityPage.waitForListToHaveLength(await browserIdentityPage.allIKVRows, ikvRows)
        expect(await browserIdentityPage.allIKVRows.length).toEqual(ikvRows)

        //Allow the transaction
        await browserIdentityPage.clickOnAddNewEntryButton()
        await browserIdentityPage.switchToTab("Point Confirmation Window", firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserTransactionModalPage.switchToTab("Point Explorer", firefox)
        await browserTransactionModalPage.waitForSpinnerNotDisplayed(firefox)
        await firefox.refresh()
        await browserIdentityPage.waitForPageToBeLoaded()
        await browserIdentityPage.waitForListToHaveElements(await browserIdentityPage.allIKVRows)
        await browserIdentityPage.waitForListToBeGreaterThan(await browserIdentityPage.allIKVRows, ikvRows)

        //Assertions on new IKV entry
        const newLength = await browserIdentityPage.allIKVRows.length
        const newExpectedLength = ikvRows+1
        expect(newLength).toEqual(newExpectedLength)
        await browserIdentityPage.moveToLastIkvRow()
        expect(await (await browserIdentityPage.getIkvNameByRowIndex(newLength)).getText()).toEqual(name)
        expect(await (await browserIdentityPage.getIkvValueByRowIndex(newLength)).getText()).toEqual(value)
        expect(await (await browserIdentityPage.getkvVersionByRowIndex(newLength)).getText()).toEqual(version)

        //Edit the added entry
        await browserIdentityPage.clickOnEditButtonOnRow(newLength)
        const newValue = faker.commerce.productName()
        await browserIdentityPage.editValueOnRow(newLength, newValue)
        await browserIdentityPage.switchToTab("Point Confirmation Window", firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserTransactionModalPage.switchToTab("Point Explorer", firefox)
        await browserTransactionModalPage.waitForSpinnerNotDisplayed(firefox)
        await firefox.refresh()
        await browserIdentityPage.waitForPageToBeLoaded()
        await browserIdentityPage.moveToLastIkvRow()

        //Assertions on edited entry
        expect(await (await browserIdentityPage.getIkvNameByRowIndex(newLength)).getText()).toEqual(name)
        expect(await (await browserIdentityPage.getIkvValueByRowIndex(newLength)).getText()).toEqual(newValue)
        expect(await (await browserIdentityPage.getkvVersionByRowIndex(newLength)).getText()).toEqual("1.0.3")
    });
});
