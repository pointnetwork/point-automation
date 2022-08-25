import LoginPage from "../pages/login.page";
import LoginExistingAccountPage from "../pages/login.existing.account.page"

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
    },
    async openPointInNewFirefox() {
        await browser.firefoxBrowser.url("https://point")
    }
}
