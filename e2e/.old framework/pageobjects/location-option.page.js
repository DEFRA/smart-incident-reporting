class Locationoption {
  // LOCATORS
  get pageHeading () { return $('h1') }
  get continueBtn () { return $('button') }

  // METHODS AND FUNCTIONS
  async getHeading () {
    await (await this.pageHeading).waitForDisplayed({})
    return (await this.pageHeading).getText()
  }

  async clickContinue () {
    await (await this.continueBtn).waitForDisplayed({})
    return (await this.continueBtn).click()
  }
}
export default new Locationoption()
