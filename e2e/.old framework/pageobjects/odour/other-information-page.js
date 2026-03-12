import OdourBasePage from './odour-base-page.js'

class OtherInformationPage extends OdourBasePage {
  // LOCATORS
  get sendReportBtn () { return $('button') }
  get otherInfoTextBox () { return $('#otherInfo') }
  async clickSendReport () {
    await (await this.sendReportBtn).waitForDisplayed({})
    return (await this.sendReportBtn).click()
  }

  async enterOtherInfo (text) {
    await (await this.otherInfoTextBox).setValue(text)
  }
}

export default new OtherInformationPage()
