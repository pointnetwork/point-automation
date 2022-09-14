import BashProcesses from "../utilities/bash.processes";

export default class Page {

  /** Method to open the page
   * @param url URL to open
   */
  async open(url) {
    await browser.url(url)
  }

  /**
   * Method to click an specific element.
   * If click method fails (Webdriverio) it tries using JS.
   * @param element element to click
   */
  async clickElement(element) {
    try {
      await element.waitForExist()
      await element.waitForDisplayed()
      await element.waitForClickable()
      await element.click()
    } catch (err) {
      this.jsClick(element)
    }
  }

  /**
   * Method to set a value in a textbox element.
   *
   * @param element textbox element
   * @param value value to set
   */
  async setValueInElement(element, value) {
    await element.waitForDisplayed()
    await element.waitForEnabled()
    await element.clearValue()
    await element.setValue(value)
  }

  /**
   * Method to send a key in an element (tab, esc, etc).
   *
   * @param element Element to send the key
   * @param key Key action
   */
  async sendKeyInElement(element, key) {
    await element.waitForDisplayed()
    await element.keys(key)
  }

  /**
   * Method to click an element and to wait for a specific time.
   *
   * @param element Element to click
   * @param time Time to wait
   */
  async clickElementAndWait(element, time) {
    try {
      await element.waitForDisplayed()
      await element.click()
      await browser.pause(time)
    } catch (err) {
      console.log(`Error clicking on element : ${err}`)
      this.jsClick(element)
      await browser.pause(time)
    }
  }

  /**
   * Method to click on an option from a dropdown list.
   *
   * @param listElements elements (list)
   * @param option Option to select
   */
  async clickOnOptionFromList(listElements, option) {
    for (let i = 0; i < listElements.length; i++) {
      const text = await listElements[i].getText()
      if (text.includes(option)) {
        await listElements[i].click()
        await browser.pause(1000)
        break
      }
    }
  }

  /**
   * Method to wait for a specific text in an element.
   *
   * @param element Element
   * @param text Text to wait
   */
  async waitForText(element, text) {
    let textChanged = false
    let timeout = 0

    while (!textChanged && timeout <= 60) {
      if (await element.getText().toUpperCase().includes(text.toUpperCase())) {
        textChanged = true
      }
      await browser.pause(1000)
      timeout += 1
    }
  }

  /**
   * Method to wait for a list to have elements.
   *
   * @param listElement Element
   */
  async waitForListToHaveElements(listElement) {
    let elementsDisplayed = false
    let retries = 10

    while (!elementsDisplayed && retries > 0) {
      if (listElement.length > 0) {
        elementsDisplayed = true
      } else {
        await browser.pause(1000)
        retries = -1
      }
    }
  }

  /**
   * Method to click using JS.
   *
   * This method is useful when the click method from webdriverio
   * doesn't work.
   * @param element element to click
   */
  async jsClick(element) {
    await browser.execute('arguments[0].click();', element)
  }

  async switchToTab(tabName) {
    let retries = 20
    let switched = false

    while (retries > 0 && !switched) {
      try {
        await browser.switchWindow(tabName)
        switched = true
      } catch (exception) {
        console.log('Tab was not opened yet. Retrying')
        await browser.pause(5000)
        retries -= 1
      }
    }
  }

  /**
   * Method to wait for an element to have text.
   * @param element Element
   */
  async waitToHaveText(element) {
    let text = '';
    let timeout = 0;

    while (text === '' && timeout <= 60) {
      if ((await element.getText()) !== '') {
        text = true;
      }
      await browser.pause(1000);
      timeout += 1;
    }
  }

  async sendTabKey() {
    await browser.keys('Tab');
  }

  async changeToActiveWindow() {
    let windowFound = false;
    let retries = 20

    while(!windowFound && retries > 0){
      await browser.pause(4000);

      try {
        const windows = await browser.chromeBrowser.getWindowHandles()
        let activeWindow = windows[0]
        if (activeWindow.constructor === Array) {
            activeWindow = activeWindow[0]
        }
        await browser.chromeBrowser.switchToWindow(activeWindow)
        windowFound = true
      }catch(exception) {
        await browser.pause(3000);
        await console.log("Window not found. Retrying...")
        retries -= 1;
      }
    }
  }
}
