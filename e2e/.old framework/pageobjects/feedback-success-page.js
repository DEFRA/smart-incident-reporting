class FeedbackSuccessPage {
  // LOCATORS
  get pageTitle () { return $('h1[class^=\'govuk-heading-xl\']') }
  get feedbackLink () { return $('=leave feedback') }
  get backButton () { return $('[id="back-link"]') }

  // METHODS AND FUNCTIONS
  async getPageTitle () {
    await (await this.pageTitle).waitForDisplayed({})
    return (await this.pageTitle).getText()
  }

  async clickFeedbackLink () {
    await (await this.feedbackLink).waitForDisplayed({})
    return (await this.feedbackLink).click()
  }

  async clickBackButton () {
    await (await this.backButton).waitForDisplayed({})
    return (await this.backButton).click()
  }
}

export default new FeedbackSuccessPage()
