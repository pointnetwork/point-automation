import LoginPage from "../pages/login.page";
import LoginExistingAccountPage from "../pages/login.existing.account.page"
import DashboardPage from "../pages/dashboard.page";
module.exports = {
    async loginIfUserIsLoggedOut() {
        try {
            await LoginPage.waitForLoginPage();
            await LoginPage.clickOnYesIHaveIt();
            await LoginExistingAccountPage.fillSecretWords(process.env.SECRET_WORDS.split(' '))
            await LoginExistingAccountPage.clickOnConfirmAndLoginButton();
        }catch(exception){
            await console.log("User is logged in")
        }
    }
}
