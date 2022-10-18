import DashboardPage from '../pages/dashboard.page'

import CommonSteps from "../utilities/common.steps";
import BashProcesses from "../utilities/bash.processes";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserWalletPage from "../pages/browser/browser.wallet.page";
import BrowserTransactionModalPage from "../pages/browser/browser.transaction.modal.page";

describe('Open/Close Browser', () => {
    it('Validate Wallet', async () => {
        //Login with second user (the one that will receive the transaction) and get the balance
        await CommonSteps.logoutUserIfIsLoggedIn();
        await CommonSteps.loginUser(3, true);
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        let receiveUserBalance = await DashboardPage.balanceValue.getText()
        receiveUserBalance = parseFloat(receiveUserBalance.split(" POINT")[0])
        const receiveUserAddress = await DashboardPage.accountFullAddress.getText()

        //Login with the first user (the one that will send the transaction)
        await BashProcesses.killAllFirefoxProcesses();
        await DashboardPage.waitForProcessesRunning(1);
        await DashboardPage.clickOnLogout()
        await DashboardPage.confirmLogout();

        await CommonSteps.loginUser();
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        //Get the balance and address from the dashboard
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

        //Open Firefox
        const firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);

        //Enter to Wallet
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnWallet()
        const browserWalletPage = await new BrowserWalletPage(firefox)
        await browserWalletPage.waitForPageToBeLoaded()

        //Validate that the Address and the Balance matches to what is displayed in the dashboard
        const addressFirstRow = await (await browserWalletPage.getAddressOnWalletTableByIndex(0)).getText()
        const balanceFirstRow = await (await browserWalletPage.getBalanceOnWalletTableByIndex(0)).getText()
        const balanceFirstRowCalculation = parseFloat(balanceFirstRow.split(" POINT")[0])

        const userBalanceValue = parseFloat(parseFloat(userBalance.split(" POINT")[0]).toFixed(8))
        const userBalanceDashboardValue = parseFloat(userBalance.split(" POINT")[0])

        expect(userBalanceValue).toEqual(balanceFirstRowCalculation)
        expect(addressFirstRow).toContain(userAddress)

        //Assertions on "Receive" option
        await browserWalletPage.clickOnReceiveButtonOnWalletTableByIndex(0)
        await browserWalletPage.receiveCopyPasteIcon.waitForDisplayed()
        expect(await browserWalletPage.receiveCopyPasteIcon).toBeDisplayed({message: "Copy paste button is not displayed"});
        expect(await browserWalletPage.receivePointQRCode).toBeDisplayed({message: "QR Code is not displayed"});
        expect(await browserWalletPage.receiveAddress).toBeDisplayed({message: "Address is not displayed"});
        expect(await browserWalletPage.receiveCloseButton).toBeDisplayed({message: "Close button is not displayed"});

        //Assertions on QR Code and Copy/Paste
        await browserWalletPage.takeScreenshotQR();
        const expectedTextQR = await browserWalletPage.receiveAddress.getValue()
        await browserWalletPage.validateQRCode(expectedTextQR);
        await browserWalletPage.clickOnCopyPasteButton()
        expect(await browserWalletPage.receiveCopyPasteCheckMark).toBeDisplayed({message: "Copy paste function didn't work"});
        await browserWalletPage.clickOnCloseButton()

        //Send an amount higher to what we have in the wallet (Negative scenario)
        await browserWalletPage.clickOnSendButtonOnWalletTableByIndex(0)
        await browserWalletPage.enterSendAddress(receiveUserAddress)
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

        //Send a valid amount (Positive scenario)
        await browserWalletPage.clickOnSendButtonOnWalletTableByIndex(0)
        await browserWalletPage.enterSendAddress(receiveUserAddress)
        await browserWalletPage.enterSendValue("0.00000001")
        await browserWalletPage.clickOnSendButtonSendOption()
        await browserWalletPage.switchToTab("Point Confirmation Window", firefox)
        await browserTransactionModalPage.clickOnAllow()
        await browserWalletPage.switchToTab("Point Explorer", firefox)
        expect(await browserWalletPage.getSuccessMessageBrowser(firefox)).toBeDisplayed({message: "Success message was not displayed"})
        await browserWalletPage.clickOnOkSuccessMessageBrowser(firefox)

        //Assertion on decreased balance
        await firefox.refresh()
        await browserWalletPage.waitForPageToBeLoaded()
        await (await browserWalletPage.getBalanceOnWalletTableByIndex(0)).waitForDisplayed()
        await DashboardPage.waitForTextDifferent(await DashboardPage.balanceValue, userBalance)
        let updatedAmount = await DashboardPage.balanceValue.getText()
        updatedAmount = parseFloat(updatedAmount.split(" POINT")[0]);
        expect(updatedAmount).toBeLessThan(userBalanceDashboardValue)

        //Login with the second user again
        await BashProcesses.killAllFirefoxProcesses();
        await DashboardPage.waitForProcessesRunning(1);

        await DashboardPage.clickOnLogout()
        await DashboardPage.confirmLogout();
        await CommonSteps.loginUser(3, true);
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();

        //Assertion on increased balance
        let receiveUserBalanceUpdated = await DashboardPage.balanceValue.getText()
        receiveUserBalanceUpdated = parseFloat(receiveUserBalanceUpdated.split(" POINT")[0])
        expect(receiveUserBalanceUpdated).toBeGreaterThan(receiveUserBalance)
    });
});
