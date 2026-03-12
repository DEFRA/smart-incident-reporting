class InWhatKindOfWaterIsThePollutionPage {
  // LOCATORS
  get pageHeading () { return $('h1') }
  get continueBtn () { return $('button') }
  get accessibilityLink () { return $('=Accessibility statement') }
  get privacyLink () { return $('=Privacy notice') }
  get feedbackLink () { return $('=leave feedback') }

  // METHODS AND FUNCTIONS
  async getHeading () {
    await (await this.pageHeading).waitForDisplayed({})
    return (await this.pageHeading).getText()
  }

  async clickContinue () {
    await (await this.continueBtn).waitForDisplayed({})
    return (await this.continueBtn).click()
  }

  async clickAccessibilityLink () {
    await (await this.accessibilityLink).waitForDisplayed({})
    return (await this.accessibilityLink).click()
  }

  async clickPrivacyNoticeLink () {
    await (await this.privacyLink).waitForDisplayed({})
    return (await this.privacyLink).click()
  }

  async clickFeedbackLink () {
    await (await this.feedbackLink).waitForDisplayed({})
    return (await this.feedbackLink).click()
  }
}
export default new InWhatKindOfWaterIsThePollutionPage()
