import DashboardPage from '../pages/dashboard.page'
import BrowserHomePage from '../pages/browser/browser.home.page'
import CommonSteps from "../utilities/common.steps";
import CommonValidations from "../utilities/common.validations";
import BashProcesses from "../utilities/bash.processes";
import BrowserFirefoxAddOnsPage from "../pages/browser/browser.firefox.add.ons.page";
import BrowserTopBarPage from "../pages/browser/browser.top.bar.page";
import BrowserWalletPage from "../pages/browser/browser.wallet.page";
import BrowserFirefoxExtensionPage from "../pages/browser/browser.firefox.extension.page";
import BrowserIdentityPage from "../pages/browser/browser.identity.page";

describe('Browser', () => {
    it('Open point and verify browser', async () => {
        await CommonSteps.loginIfUserIsLoggedOut();

        //Open dashboard and browser
        await DashboardPage.waitForDashboardDisplayed();
        await DashboardPage.waitForProcessesRunning();
        expect(await BashProcesses.getFirefoxProcess()).toEqual(true);
        await DashboardPage.waitForProcessesRunning();
        await BashProcesses.killAllFirefoxProcesses();
        await DashboardPage.waitForProcessesRunning(1);
        await browser.pause(10000)
        await DashboardPage.launchPointBrowserButton.waitForDisplayed();
        expect(await DashboardPage.launchPointBrowserButton).toBeDisplayed();

        const firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);
        const browserHome = await new BrowserHomePage(firefox)
        await browserHome.waitForPageToBeLoaded();
        await CommonValidations.isFirefoxPageDisplayed(browserHome);

        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnWallet()
        const browserWalletPage = await new BrowserWalletPage(firefox)
        await browserWalletPage.waitForPageToBeLoaded()

        const balanceFirstRow = await (await browserWalletPage.getBalanceOnWalletTableByIndex(0)).getText()
        const balanceFirstRowCalculation = parseFloat(balanceFirstRow.split(" POINT")[0])

        await browserTopBarPage.clickOnIdentityButton()
        const browserIdentityPage = await new BrowserIdentityPage(firefox)
        await browserIdentityPage.waitForPageToBeLoaded()

        const userName = await browserIdentityPage.handleValue.getText();
        const userId = await browserIdentityPage.ownerValue.getText();

        await firefox.url("about:addons")

        const browserFirefoxAddOnsPage = await new BrowserFirefoxAddOnsPage(firefox);
        expect(await browserFirefoxAddOnsPage.addOnTitle).toBeDisplayed();
        expect(await browserFirefoxAddOnsPage.addOnTitle).toHaveText("Point Network");
        expect(await browserFirefoxAddOnsPage.addOnTrigger).toBeDisplayed();
        expect(await browserFirefoxAddOnsPage.addOnDescription).toBeDisplayed();
        expect(await browserFirefoxAddOnsPage.addOnDescription).toHaveText("A Browser Extension for Point Network");

        await CommonSteps.openPointExtension(firefox)
        const browserFirefoxExtensionPage = await new BrowserFirefoxExtensionPage(firefox);
        await browserFirefoxExtensionPage.waitForPageLoaded();

        expect(await browserFirefoxExtensionPage.globalChainIdSelector).toBeDisplayed({message: "Global Chain ID selector is not displayed"})
        expect(await browserFirefoxExtensionPage.loggedInAsUser).toBeDisplayed({message: "User is not displayed"})
        expect(await browserFirefoxExtensionPage.loggedInAsId).toBeDisplayed({message: "User Id is not displayed"})
        expect(await browserFirefoxExtensionPage.availableBalance).toBeDisplayed({message: "Balance is not displayed"})
        expect(await browserFirefoxExtensionPage.sendMoneyButton).toBeDisplayed({message: "Send Money button is not displayed"})
        expect(await browserFirefoxExtensionPage.pointExplorerButton).toBeDisplayed({message: "Point Explorer button is not displayed"})
        expect(await browserFirefoxExtensionPage.myWalletButton).toBeDisplayed({message: "My Wallet button is not displayed"})
        expect(await browserFirefoxExtensionPage.sdkVersion).toBeDisplayed({message: "SDK version is not displayed"})

        expect(await browserFirefoxExtensionPage.loggedInAsUser).toHaveText(userName)
        expect(await browserFirefoxExtensionPage.loggedInAsId).toHaveText(userId)
        expect(await browserFirefoxExtensionPage.availableBalance).toHaveText(balanceFirstRowCalculation)

        await browserFirefoxExtensionPage.clickOnGlobalChainIdSelector()
        expect(await browserFirefoxExtensionPage.optionsSelector.length).toBeGreaterThan(1)
        expect(await browserFirefoxExtensionPage.optionsSelector[0]).toHaveText("mainnet")
        expect(await browserFirefoxExtensionPage.optionsSelector[1]).toHaveText("Xnet")
        expect(await browserFirefoxExtensionPage.optionsSelector[2]).toHaveText("Rinkeby")
        expect(await browserFirefoxExtensionPage.optionsSelector[3]).toHaveText("Solana Devnet")
        expect(await browserFirefoxExtensionPage.optionsSelector[4]).toHaveText("Solana")
        expect(await browserFirefoxExtensionPage.optionsSelector[0]).toBeClickable({message: "mainnet option is not clickable"})
        expect(await browserFirefoxExtensionPage.optionsSelector[1]).toBeClickable({message: "Xnet option is not clickable"})
        expect(await browserFirefoxExtensionPage.optionsSelector[2]).toBeClickable({message: "Rinkeby option is not clickable"})
        expect(await browserFirefoxExtensionPage.optionsSelector[3]).toBeClickable({message: "Solana Devnet option is not clickable"})
        expect(await browserFirefoxExtensionPage.optionsSelector[4]).toBeClickable({message: "Solana option is not clickable"})

        await browserFirefoxExtensionPage.clickOnGlobalChainSelectorOptionByIndex(0)
        await browserFirefoxExtensionPage.clickOnPointExplorer();
        await browserFirefoxExtensionPage.switchToTabByIndex(1, firefox);
        await browserHome.waitForPageToBeLoaded();
        expect(browserHome.blogButton).toBeDisplayed({message:"User was not redirected to Point"})

        await CommonSteps.openPointExtension(firefox)
        await browserFirefoxExtensionPage.waitForPageLoaded();
        await browserFirefoxExtensionPage.clickOnMyWalletButton();
        await browserFirefoxExtensionPage.switchToTabByIndex(2, firefox);
        await browserWalletPage.waitForPageToBeLoaded();
        expect(browserWalletPage.erc20TokensTitle).toBeDisplayed({message:"User was not redirected to Wallet"})
    });
});
