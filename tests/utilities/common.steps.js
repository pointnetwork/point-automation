import LoginPage from "../pages/login.page";
import LoginExistingAccountPage from "../pages/login.existing.account.page"
import Credentials from "../resources/decryptedcredentials.json"
import InstallerTermsConditionsPage from "../pages/installer/installer.terms.conditions.page";
import InstallerWelcomePage from "../pages/installer/installer.welcome.page";
import CommonSteps from "./utils";
const fs = require('fs')

module.exports = {
    async loginIfUserIsLoggedOut() {
        try {
            await this.loginUser()
        }catch(exception){
            await console.log("User is logged in")
        }
    },
    async loginUser() {
        await this.installAppIfIsRequired()
        await console.log("Logging in user...")

        if(process.platform === "linux") {
            await console.log("Removing Point lock file. Files : ")

            await fs.readdirSync("/home/runner/.point").forEach(file => {
                console.log(file);
            });

            CommonSteps.rmdir("/home/runner/.point/point_dashboard.lock")
            await console.log("Point lockfile was removed. Files : ")

            await fs.readdirSync("/home/runner/.point").forEach(file => {
                console.log(file);
            });
        }

        await LoginPage.waitForLoginPage();
        await LoginPage.clickOnYesIHaveIt();
        const credentials = Credentials.secretWords
        const credentialsSplit = credentials.split(' ')
        await LoginExistingAccountPage.fillSecretWords(credentialsSplit)
        await LoginExistingAccountPage.clickOnConfirmAndLoginButton();
        await browser.pause(5000)
        await LoginPage.changeToActiveWindow();
    },
    async openPointInNewFirefox() {
        await browser.firefoxBrowser.url("https://point")
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
    }
}
