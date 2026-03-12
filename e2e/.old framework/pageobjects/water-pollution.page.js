class WaterPollutionPage {
  // LOCATORS
  get pageHeading () { return $('h1[class="govuk-heading-xl"]') }
  get startBtn () { return $('a[role="button"]') }

  // METHODS AND FUNCTIONS
  async getHeading () {
    await (await this.pageHeading).waitForDisplayed({})
    return (await this.pageHeading).getText()
  }

  async clickStartNow () {
    await (await this.startBtn).waitForDisplayed({})
    return (await this.startBtn).click()
  }
}
export default new WaterPollutionPage()
