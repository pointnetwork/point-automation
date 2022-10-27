import Page from '../page'

export default class BrowserFirefoxAddOnsPage extends Page {
    constructor(firefox) {
        super();
        this.driver = firefox
    }

    get addOnTitle() {
        return this.driver.$('.card-contents h3')
    }

    get addOnTrigger() {
        return this.driver.$('.card-contents input')
    }

    get addOnDescription() {
        return this.driver.$('.card-contents .addon-description')
    }

    async waitForPageLoaded() {
        await this.addOnTitle.waitForDisplayed()
    }
}
