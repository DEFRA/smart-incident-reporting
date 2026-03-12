import WaterPollutionBasePage from './water-pollution-base.page.js'

class DeadFishPage extends WaterPollutionBasePage {
  // LOCATORS
  get yesDetailsTextBox () {
    return $('textarea')
  }

  async enterYesDetails (text) {
    await (await this.yesDetailsTextBox).waitForDisplayed({})
    await (await this.yesDetailsTextBox).setValue(text)
  }
}

export default new DeadFishPage()
