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
import BrowserWalletPage from "../pages/browser/browser.wallet.page";
import BrowserTransactionModalPage from "../pages/browser/browser.transaction.modal.page";

describe('Open/Close Browser', () => {
    it('Validate Wallet', async () => {
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
        const userBalance = await DashboardPage.balanceValue.getText()
        const userAddress = await DashboardPage.accountAddress.getText()

        const firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);

        //Enter to Wallet
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnWallet()
        const browserWalletPage = await new BrowserWalletPage(firefox)
        await browserWalletPage.waitForPageToBeLoaded()

        const addressFirstRow = await (await browserWalletPage.getAddressOnWalletTableByIndex(0)).getText()
        const balanceFirstRow = await (await browserWalletPage.getBalanceOnWalletTableByIndex(0)).getText()
        const balanceFirstRowCalculation = parseFloat(balanceFirstRow.split(" POINT")[0])
        //Round-up 9 digits
        const userBalanceValue = parseFloat(parseFloat(userBalance.split(" POINT")[0]).toFixed(8))

        expect(userBalanceValue).toEqual(balanceFirstRowCalculation)
        expect(addressFirstRow).toContain(userAddress)

        await browserWalletPage.clickOnReceiveButtonOnWalletTableByIndex(0)
        await browserWalletPage.receiveCopyPasteIcon.waitForDisplayed()

        expect(await browserWalletPage.receiveCopyPasteIcon).toBeDisplayed({message: "Copy paste button is not displayed"});
        expect(await browserWalletPage.receivePointQRCode).toBeDisplayed({message: "QR Code is not displayed"});
        expect(await browserWalletPage.receiveAddress).toBeDisplayed({message: "Address is not displayed"});
        expect(await browserWalletPage.receiveCloseButton).toBeDisplayed({message: "Close button is not displayed"});

        await browserWalletPage.clickOnCopyPasteButton()
        expect(await browserWalletPage.receiveCopyPasteCheckMark).toBeDisplayed({message: "Copy paste function didn't work"});

        await browserWalletPage.clickOnCloseButton()
        await browserWalletPage.clickOnSendButtonOnWalletTableByIndex(0)
        await browserWalletPage.enterSendAddress(process.env.ACCOUNT_SECOND_USER)
        await browserWalletPage.enterSendValue("10")
        await browserWalletPage.clickOnSendButtonSendOption()

        await browserWalletPage.switchToTab("Point Confirmation Window", firefox)
        const browserTransactionModalPage = await new BrowserTransactionModalPage(firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserWalletPage.switchToTab("Point Explorer", firefox)

        await (await browserWalletPage.getErrorMessageBrowser(firefox)).waitForDisplayed()

        expect(await browserWalletPage.getErrorMessageBrowser(firefox)).toBeDisplayed({message: "Error message was not displayed"})
        expect(await browserWalletPage.getErrorMessageDescriptionBrowser(firefox)).toBeDisplayed({message: "Error description was not displayed"})
        expect(await browserWalletPage.getErrorMessageDescriptionBrowser(firefox)).toHaveText("Error: rpc error: code = Unknown desc = rpc error: code = Internal desc = insufficient balance for transfer: unknown request")
        await browserWalletPage.clickOnOkSuccessMessageBrowser(firefox)
        await browserWalletPage.clickOnCancelButtonSendOption()

        const expectedBalance = balanceFirstRowCalculation - 0.00000001

        await browserWalletPage.clickOnSendButtonOnWalletTableByIndex(0)
        await browserWalletPage.enterSendAddress(process.env.ACCOUNT_SECOND_USER)
        await browserWalletPage.enterSendValue("0.00000001")
        await browserWalletPage.clickOnSendButtonSendOption()
        await browserWalletPage.switchToTab("Point Confirmation Window", firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserWalletPage.switchToTab("Point Explorer", firefox)

        expect(await browserWalletPage.getSuccessMessageBrowser(firefox)).toBeDisplayed({message: "Success message was not displayed"})
        await browserWalletPage.clickOnOkSuccessMessageBrowser(firefox)
        await firefox.refresh()
        await browserWalletPage.waitForPageToBeLoaded()

        await (await browserWalletPage.getBalanceOnWalletTableByIndex(0)).waitForDisplayed()

        await browserWalletPage.waitForText(await browserWalletPage.getBalanceOnWalletTableByIndex(0), expectedBalance.toString())
        const updatedAmount = parseFloat((await (await browserWalletPage.getBalanceOnWalletTableByIndex(0)).getText()).split(" POINT")[0])

        expect(updatedAmount).toEqual(expectedBalance)

        await DashboardPage.clickOnLogout()
        await DashboardPage.confirmLogout();

    });
});
