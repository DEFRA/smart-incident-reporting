class Locationdescription {
  // LOCATORS
  get pageHeading () { return $('h1') }
  get continueBtn () { return $('#continue') }
  get textBox () { return $('#location') }
  get searchButton () { return $('#search-location') }
  get map () { return $('.map') }

  // METHODS AND FUNCTIONS
  async getHeading () {
    await (await this.pageHeading).waitForDisplayed({})
    return (await this.pageHeading).getText()
  }

  async clickContinue () {
    await (await this.continueBtn).waitForDisplayed({})
    return (await this.continueBtn).click()
  }

  async enterLocation (text) {
    await (await this.textBox).waitForDisplayed({})
    await (await this.textBox).setValue(text)
  }

  async clickSearch () {
    await (await this.searchButton).waitForDisplayed({})
    await (await this.searchButton).click()
  }

  async clickMap () {
    await (await this.map).waitForDisplayed({})
    await (await this.map).click()
  }
}
export default new Locationdescription()
