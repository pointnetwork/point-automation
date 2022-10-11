import Page from './page'
import DashboardPage from "./dashboard.page";

class LoginPage extends Page {
    get noGenerateOneButton() {
        return $('#root svg[data-testid=\'KeyIcon\']')
    }

    get yesIHaveItButton() {
        return $('svg[data-testid=\'DownloadIcon\']')
    }

    async waitForPageToBeLoaded() {
        await console.log("Checking login page...")
        try {
            await this.noGenerateOneButton.waitForDisplayed({timeout: 7000});
        }catch(exception) {
            await console.log("User is still logged in. Logging out now...")
            await DashboardPage.clickOnLogout()
            await DashboardPage.confirmLogout();

        }
        await this.noGenerateOneButton.waitForDisplayed({timeout: 7000});
    }

    async waitForLoginPage() {
        await console.log("Checking login page...")
        await this.noGenerateOneButton.waitForDisplayed({timeout: 7000});
    }

    async clickOnNoGenerateOne() {
        await super.clickElement(await this.noGenerateOneButton);
    }

    async clickOnYesIHaveIt() {
        await super.clickElement(await this.yesIHaveItButton);
    }
}

export default new LoginPage()
