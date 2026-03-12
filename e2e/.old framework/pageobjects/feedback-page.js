class FeedbackPage {
  // LOCATORS
  get pageTitle () { return $('h1[class^=\'govuk-heading-xl\']') }
  get sendFeedback () { return $('button[type="submit"]') }
  get textBox () { return $('textarea') }

  // METHODS AND FUNCTIONS
  async getPageTitle () {
    await (await this.pageTitle).waitForDisplayed({})
    return (await this.pageTitle).getText()
  }

  async clickSendFeedback () {
    await (await this.sendFeedback).waitForDisplayed({})
    return (await this.sendFeedback).click()
  }

  async enterFeedback (text) {
    await (await this.textBox).waitForDisplayed({})
    await (await this.textBox).setValue(text)
  }
}

export default new FeedbackPage()
