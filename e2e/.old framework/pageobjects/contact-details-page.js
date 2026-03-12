class ContactDetailsPage {
  get fullNameInput () {
    return $('#fullName')
  }

  get emailInput () {
    return $('#email')
  }

  get phoneInput () {
    return $('#phone')
  }

  get pageHeading () { return $('h1') }
  get errorSummary () { return $('[role="alert"]') }
  get answerIDError () { return $('[id="answerId-error"]') }
  get continueBtn () { return $('button[type="submit"]') }

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

  async enterName (text) {
    await (await this.fullNameInput).waitForDisplayed({})
    await (await this.fullNameInput).setValue(text)
  }

  async enterEmail (text) {
    await (await this.emailInput).waitForDisplayed({})
    await (await this.emailInput).setValue(text)
  }

  async enterPhone (text) {
    await (await this.phoneInput).waitForDisplayed({})
    await (await this.phoneInput).setValue(text)
  }
}

export default new ContactDetailsPage()
