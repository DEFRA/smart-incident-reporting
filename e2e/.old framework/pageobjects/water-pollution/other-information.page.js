import WaterPollutionBasePage from './water-pollution-base.page.js'

class OtherInformationPage extends WaterPollutionBasePage {
  get otherInfoTextBox () { return $('[id="otherInfo"]') }

  async enterOtherInfo (text) {
    await (await this.otherInfoTextBox).waitForDisplayed({})
    await (await this.otherInfoTextBox).setValue(text)
  }
}

export default new OtherInformationPage()
