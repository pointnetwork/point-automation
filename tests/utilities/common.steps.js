import LoginPage from "../pages/login.page";
import LoginExistingAccountPage from "../pages/login.existing.account.page"
import BashProcesses from "./bash.processes";
import Credentials from "../resources/decryptedcredentials.json"

module.exports = {
    async loginIfUserIsLoggedOut() {
        try {
            await this.loginUser()
        }catch(exception){
            await console.log("User is logged in")
        }
    },
    async loginUser() {
        await console.log("Logging in user...")
        await LoginPage.waitForLoginPage();
        await LoginPage.clickOnYesIHaveIt();
        const credentials = Credentials.secretWords
        console.log("Credentials :" + credentials)
        const credentialsSplit = Credentials.split(' ')
        console.log("Credentials Split:" + credentialsSplit)
        await LoginExistingAccountPage.fillSecretWords(credentialsSplit)
        await LoginExistingAccountPage.clickOnConfirmAndLoginButton();
        await BashProcesses.killPoint();
        await browser.pause(5000);
        await browser.reloadSession();
        await browser.pause(5000);
    },
    async openPointInNewFirefox() {
        await browser.firefoxBrowser.url("https://point")
    }
}
