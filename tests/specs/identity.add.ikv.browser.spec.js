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
import BrowserMyIdentitiesPage from "../pages/browser/browser.my.identities.page";
import BrowserIdentityPage from "../pages/browser/browser.identity.page";
import {faker} from "@faker-js/faker";
import BrowserTransactionModalPage from "../pages/browser/browser.transaction.modal.page";

describe('Identity / IKV', () => {
    it('Validate an IKV can be added correctly', async () => {
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
        await browserTopBarPage.clickOnIdentityButton()

        const browserIdentityPage = await new BrowserIdentityPage(firefox)
        await browserIdentityPage.waitForPageToBeLoaded()

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

        await browserIdentityPage.addNewEntry(faker.commerce.productName(), faker.commerce.productName(), "1.0.2")
        await browserIdentityPage.switchToTab("Point Confirmation Window", firefox)
        const browserTransactionModalPage = await new BrowserTransactionModalPage(firefox)
        await browserTransactionModalPage.clickOnCancel()
        await browserTransactionModalPage.switchToTab("Point Explorer", firefox)
        await browserIdentityPage.waitForListToHaveLength(await browserIdentityPage.allIKVRows, ikvRows)

        expect(await browserIdentityPage.allIKVRows.length).toEqual(ikvRows)
        await browserIdentityPage.clickOnAddNewEntryButton()
        await browserIdentityPage.switchToTab("Point Confirmation Window", firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserTransactionModalPage.switchToTab("Point Explorer", firefox)
        await browserTransactionModalPage.waitForSpinnerNotDisplayed(firefox)
        await firefox.refresh()
        await browserIdentityPage.waitForPageToBeLoaded()
        await browserIdentityPage.waitForListToHaveElements(await browserIdentityPage.allIKVRows)
        await browserIdentityPage.waitForListToBeGreaterThan(await browserIdentityPage.allIKVRows, ikvRows)

        const newLength = await browserIdentityPage.allIKVRows.length
        const newExpectedLength = ikvRows+1
        expect(newLength).toEqual(newExpectedLength)
    });
});
