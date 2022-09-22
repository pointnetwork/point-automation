import LoginPage from "../pages/login.page";
import LoginExistingAccountPage from "../pages/login.existing.account.page"
import Credentials from "../resources/decryptedcredentials.json"
import InstallerTermsConditionsPage from "../pages/installer/installer.terms.conditions.page";
import InstallerWelcomePage from "../pages/installer/installer.welcome.page";
import Utils from "./utils";
import {remote} from "webdriverio";
const BashProcesses = require('./bash.processes')
const path = require('path')

module.exports = {
    async loginIfUserIsLoggedOut() {
        try {
            await this.loginUser()
        }catch(exception){
            await console.log("User is logged in")
        }
    },
    async loginUser(processes=3) {
        await this.installAppIfIsRequired()
        await console.log("Logging in user...")
        await Utils.reloadSessionLinux()

        await LoginPage.waitForLoginPage();
        await LoginPage.clickOnYesIHaveIt();
        const credentials = Credentials.secretWords
        const credentialsSplit = credentials.split(' ')
        await LoginExistingAccountPage.fillSecretWords(credentialsSplit)
        await LoginExistingAccountPage.clickOnConfirmAndLoginButton();
        await browser.pause(5000)
        if(process.platform === "linux") {
            await BashProcesses.killPoint()
            await browser.pause(5000)
            await browser.reloadSession()
            await browser.pause(5000)
        }
        await LoginPage.changeToActiveWindow();
    },
    async openPointInNewFirefox(instance) {
        await console.log("Accessing Point Private URL")
        await instance.url("https://point/")
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
        let created = false
        let retries = 3
        let firefoxInstance

        while(!created && retries > 0) {
            try {
                firefoxInstance = await remote({
                    logLevel: 'error',
                    path: '/', // remove `path` if you decided using something different from driver binaries.
                    capabilities: {
                        browserName: 'firefox',
                        args: ['-headless']
                        // acceptInsecureCerts: true,
                        // 'moz:firefoxOptions': {
                        //     args: ['-profile', "/Users/runner/.point/keystore/liveprofile"]
                        // }
                    },
                })
            } catch (exception) {
                console.log("There was an issue creating the Firefox instance. Retrying..")
                retries-=1
            }
        }

        return firefoxInstance
    }
}
