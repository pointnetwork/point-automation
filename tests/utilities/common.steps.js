import LoginPage from "../pages/login.page";
import LoginExistingAccountPage from "../pages/login.existing.account.page"
import Credentials from "../resources/decryptedcredentials.json"
import InstallerTermsConditionsPage from "../pages/installer/installer.terms.conditions.page";
import InstallerWelcomePage from "../pages/installer/installer.welcome.page";
import Utils from "./utils";
import {remote} from "webdriverio";
import DashboardPage from "../pages/dashboard.page";
import BashProcesses from "./bash.processes";

module.exports = {
    async loginIfUserIsLoggedOut() {
        try {
            await this.loginUser()
        }catch(exception){
            await console.log("User is logged in")
        }
    },
    async loginUser(processes=3, secondUser=false) {
        let credentials;

        if(secondUser) {
            credentials = Credentials.secondSecretWords;
        }else {
            credentials = Credentials.secretWords;
        }
        await this.installAppIfIsRequired()
        await console.log("Logging in user...")
        await LoginPage.waitForLoginPage();
        await LoginPage.clickOnYesIHaveIt();
        const credentialsSplit = credentials.split(' ')
        await LoginExistingAccountPage.fillSecretWords(credentialsSplit)
        await LoginExistingAccountPage.clickOnConfirmAndLoginButton();
        await browser.pause(5000)
        // if(process.platform === "linux") {
        //     await Utils.reloadSessionLinux()
        // }
        await LoginPage.changeToActiveWindow();
    },
    async openPointInNewFirefox(instance) {
        await console.log("Accessing Point Private URL")
        await instance.url("https://point/")
        await console.log("Point Private URL loaded!")
    },
    async installAppIfIsRequired() {
        if(await InstallerTermsConditionsPage.isInstallerDisplayed()){
            await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
            await InstallerTermsConditionsPage.clickOnUnderstandAndAgreeButton();
            await InstallerWelcomePage.waitForInstallerToBeDisplayed();
            await InstallerWelcomePage.clickOnStartInstallationButton();
            await InstallerWelcomePage.waitForInstallationCompleted();
            await LoginPage.waitForPageToBeLoaded();
        }
    },
    async createFirefoxInstance() {
        await console.log("Creating Firefox instance...")
        let configurationArgs;

        if(browser.config.pipeline) {
            configurationArgs = ['-headless', '-profile', await Utils.getPointFolderPath() + "/keystore/liveprofile"]
        }else {
            configurationArgs = ['-profile', await Utils.getPointFolderPath() + "/keystore/liveprofile"]
        }

        const firefoxInstance = await remote({
            logLevel: "error",
            path: '/', // remove `path` if you decided using something different from driver binaries.
            capabilities: {
                browserName: 'firefox',
                acceptInsecureCerts: true,
                'moz:firefoxOptions': {
                    args: configurationArgs
                },
            },
            waitforTimeout: 60000
        })
        await console.log("Firefox instance created!")
        return firefoxInstance
    },
    async logoutUserIfIsLoggedIn() {
        try {
            await console.log("Checking if it's necessary to logout user...")
            await DashboardPage.waitForDashboardDisplayed();
            await BashProcesses.killAllFirefoxProcesses();
            await DashboardPage.waitForProcessesRunning(1);
            await DashboardPage.clickOnLogout();
            await DashboardPage.confirmLogout();
        }catch(exception){
            await console.log("User is not logged in")
        }
    },
}
