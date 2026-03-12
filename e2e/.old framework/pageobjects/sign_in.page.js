class SignInPage {
  // LOCATORS
  get pageHeading () { return $('h1[class="govuk-heading-l"]') }
  get fullNameTextBox () { return $('#fullName') }
  get phoneTextBox () { return $('#phone') }
  get accessCodeTextBox () { return $('#accessCode') }
  get signInBtn () { return $('button[type="submit"]') }
  get errorSummary () { return $('.govuk-error-summary') }
  get enterEmailTextBox () { return $('#email') }

  // METHODS AND FUNCTIONS
  async getHeading () {
    await (await this.pageHeading).waitForDisplayed({})
    return (await this.pageHeading).getText()
  }

  async getErrorSummary () {
    await (await this.errorSummary).waitForDisplayed()
    return (await this.errorSummary).getText()
  }

  async enterName (text) {
    await (await this.fullNameTextBox).waitForDisplayed({})
    await (await this.fullNameTextBox).setValue(text)
  }

  async enterPhone (text) {
    await (await this.phoneTextBox).waitForDisplayed({})
    await (await this.phoneTextBox).setValue(text)
  }

  async enterAccessCode (text) {
    await (await this.accessCodeTextBox).waitForDisplayed({})
    await (await this.accessCodeTextBox).setValue(text)
  }

  async clickSignIn () {
    await (await this.signInBtn).waitForDisplayed({})
    return (await this.signInBtn).click()
  }

  async enterEmail (text) {
    await (await this.enterEmailTextBox).waitForDisplayed({})
    return (await this.enterEmailTextBox).setValue(text)
  }
}
export default new SignInPage()
