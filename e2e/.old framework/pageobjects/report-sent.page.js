class OtherInformationPage {
  // LOCATORS
  get pageHeading () { return $('h1') }
  get makeAnotherReport () { return $('div') }
  get confPanel () { return $('.govuk-panel--confirmation') }

  // METHODS AND FUNCTIONS
  async getHeading () {
    await (await this.pageHeading).waitForDisplayed({})
    return (await this.pageHeading).getText()
  }

  async selectMakeAnotherReport () {
    await (await this.makeAnotherReport).waitForDisplayed({})
    return (await this.makeAnotherReport).click()
  }

  async getConfPanel () {
    await (await this.confPanel).waitForDisplayed({})
    return (await this.confPanel).getText()
  }
}
export default new OtherInformationPage()
