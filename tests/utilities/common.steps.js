import LoginPage from "../pages/login.page";
import LoginExistingAccountPage from "../pages/login.existing.account.page"
import BashProcesses from "./bash.processes";

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
        await LoginExistingAccountPage.fillSecretWords(process.env.SECRET_WORDS.split(' '))
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
