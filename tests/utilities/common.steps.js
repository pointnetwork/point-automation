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
            console.log("User is logged in")
            console.log({exception})
        }
    },
    async loginUser(processes=3) {
        await this.installAppIfIsRequired()
        await console.log("Logging in user...")
        await LoginPage.waitForLoginPage();
        await LoginPage.clickOnYesIHaveIt();
        const credentials = Credentials.secretWords
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
        const c =await InstallerTermsConditionsPage.isInstallerDisplayed()
        console.log({c})
        if(c){
            console.log('*1')
            await InstallerTermsConditionsPage.waitForInstallerToBeDisplayed();
            await InstallerTermsConditionsPage.clickOnUnderstandAndAgreeButton();
            await InstallerWelcomePage.waitForInstallerToBeDisplayed();
            await InstallerWelcomePage.clickOnStartInstallationButton();
            await InstallerWelcomePage.waitForInstallationCompleted();
            await LoginPage.waitForPageToBeLoaded();
            console.log('*2')
        }
    },
    async createFirefoxInstance() {
        await console.log("Creating Firefox instance...")
        const firefoxInstance = await remote({
            logLevel: "error",
            path: '/', // remove `path` if you decided using something different from driver binaries.
            capabilities: {
                browserName: 'firefox',
                acceptInsecureCerts: true,
                'moz:firefoxOptions': {
                    args: ['-headless', '-profile', await Utils.getPointFolderPath() + "/keystore/liveprofile"]
                },
            },
        })
        await console.log("Firefox instance created!")
        return firefoxInstance
    }
}
