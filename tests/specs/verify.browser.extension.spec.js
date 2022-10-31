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

let firefox
let balanceFirstRowCalculation
let userName
let userId
let browserFirefoxExtensionPage
let browserHome
let browserWalletPage

describe('Point SDK Extension UI', () => {
    it('Displays Identity, Address & Token Balance. Allows user to click to wallet and Point Home page. (Validate Extension is Installed)', async () => {
        //Login
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

        //Creates Firefox Instance
        firefox = await CommonSteps.createFirefoxInstance()
        await CommonSteps.openPointInNewFirefox(firefox);
        browserHome = await new BrowserHomePage(firefox)
        await browserHome.waitForPageToBeLoaded();
        await CommonValidations.isFirefoxPageDisplayed(browserHome);

        //Click on Wallet
        const browserTopBarPage = await new BrowserTopBarPage(firefox)
        await browserTopBarPage.clickOnWallet()
        browserWalletPage = await new BrowserWalletPage(firefox)
        await browserWalletPage.waitForPageToBeLoaded()

        //Get information to be validated later
        const balanceFirstRow = await (await browserWalletPage.getBalanceOnWalletTableByIndex(0)).getText()
        balanceFirstRowCalculation = parseFloat(balanceFirstRow.split(" POINT")[0])

        await browserTopBarPage.clickOnIdentityButton()
        const browserIdentityPage = await new BrowserIdentityPage(firefox)
        await browserIdentityPage.waitForPageToBeLoaded()

        userName = await browserIdentityPage.handleValue.getText();
        userId = await browserIdentityPage.ownerValue.getText();

        //Open Firefox ADDONS page
        await firefox.url("about:addons")
        const browserFirefoxAddOnsPage = await new BrowserFirefoxAddOnsPage(firefox);

        //Validate that Extension is installed correctly
        expect(await browserFirefoxAddOnsPage.addOnTitle).toBeDisplayed();
        expect(await browserFirefoxAddOnsPage.addOnTitle).toHaveText("Point Network");
        expect(await browserFirefoxAddOnsPage.addOnTrigger).toBeDisplayed();
        expect(await browserFirefoxAddOnsPage.addOnDescription).toBeDisplayed();
        expect(await browserFirefoxAddOnsPage.addOnDescription).toHaveText("A Browser Extension for Point Network");
    })
    it('Displays Identity, Address & Token Balance. Allows user to click to wallet and Point Home page. (Open Extension and validate UI)', async () => {
        //Open Extension
        await CommonSteps.openPointExtension(firefox)
        browserFirefoxExtensionPage = await new BrowserFirefoxExtensionPage(firefox);
        await browserFirefoxExtensionPage.waitForPageLoaded();

        //UI Assertions
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
    })
    it('Displays Identity, Address & Token Balance. Allows user to click to wallet and Point Home page. (Validate Global Chain ID selector)', async () => {
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
    })
    it('Displays Identity, Address & Token Balance. Allows user to click to wallet and Point Home page. (Validate Point Explorer)', async () => {
        //Click on Point Explorer button
        await browserFirefoxExtensionPage.clickOnPointExplorer();
        await browserFirefoxExtensionPage.switchToTabByIndex(1, firefox);
        await browserHome.waitForPageToBeLoaded();
        expect(browserHome.blogButton).toBeDisplayed({message: "User was not redirected to Point"})
    })
    it('Displays Identity, Address & Token Balance. Allows user to click to wallet and Point Home page. (Validate My Wallet)', async () => {
        //Click on My Wallet button
        await CommonSteps.openPointExtension(firefox)
        await browserFirefoxExtensionPage.waitForPageLoaded();
        await browserFirefoxExtensionPage.clickOnMyWalletButton();
        await browserFirefoxExtensionPage.switchToTabByIndex(2, firefox);
        await browserWalletPage.waitForPageToBeLoaded();
        expect(browserWalletPage.erc20TokensTitle).toBeDisplayed({message:"User was not redirected to Wallet"})
    });
});
