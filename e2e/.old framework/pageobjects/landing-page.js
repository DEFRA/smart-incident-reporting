class LandingPage {
  // LOCATORS
  get waterPollutionLink () {
    return $('a[href="/water-pollution-start"].govuk-link')
  }

  get odourLink () {
    return $('a[href="/smell-start"].govuk-link')
  }

  async clickWaterPollutionLink () {
    await (await this.waterPollutionLink).waitForDisplayed({})
    return (await this.waterPollutionLink).click()
  }

  async clickOdourLink () {
    await (await this.odourLink).waitForDisplayed({})
    return (await this.odourLink).click()
  }
}
export default new LandingPage()
