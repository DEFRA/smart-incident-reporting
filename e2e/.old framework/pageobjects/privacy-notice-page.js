class PrivacyStatementPage {
  // LOCATORS
  get pageTitle () { return $('h1[class^=\'govuk-heading-xl\']') }
  get pageContents () { return $('main#main-content') }

  // METHODS AND FUNCTIONS
  async getPageTitle () {
    await (await this.pageTitle).waitForDisplayed({})
    return (await this.pageTitle).getText()
  }

  async checkPrivacyContent () {
    await (await this.pageContents).waitForDisplayed({})
    return (await this.pageContents).getText()
  }
}

export default new PrivacyStatementPage()
