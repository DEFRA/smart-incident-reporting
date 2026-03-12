import WaterPollutionBasePage from './water-pollution-base.page.js'

class PollutionComingFrom extends WaterPollutionBasePage {
  get yesDetailsTextBox () { return $('textarea') }

  async enterYesDetails (text) {
    await (await this.yesDetailsTextBox).waitForDisplayed({})
    await (await this.yesDetailsTextBox).setValue(text)
  }
}

export default new PollutionComingFrom()
