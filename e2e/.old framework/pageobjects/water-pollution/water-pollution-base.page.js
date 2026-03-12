export default class WaterPollutionBasePage {
  // LOCATORS
  get pageHeading () { return $('h1') }
  get errorSummary () { return $('[role="alert"]') }
  get answerIDError () { return $('[id="answerId-error"]') }
  get continueBtn () { return $('button[type="submit"]') }

  // METHODS AND FUNCTIONS
  async getHeading () {
    await (await this.pageHeading).waitForDisplayed({})
    return (await this.pageHeading).getText()
  }

  async getErrorSummary () {
    await (await this.errorSummary).waitForDisplayed({})
    return (await this.errorSummary).getText()
  }

  async getAnswerIDError () {
    await (await this.answerIDError).waitForDisplayed({})
    return (await this.answerIDError).getText()
  }

  async clickContinue () {
    await (await this.continueBtn).waitForDisplayed({})
    return (await this.continueBtn).click()
  }
}
