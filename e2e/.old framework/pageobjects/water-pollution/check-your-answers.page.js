import WaterPollutionBasePage from './water-pollution-base.page.js'

class CheckYourAnswersPage extends WaterPollutionBasePage {
  // LOCATORS
  get finishSendBtn () {
    return $('[type="submit"]')
  }

  async clickFinishAndSendReport () {
    await (await this.finishSendBtn).waitForDisplayed({})
    return (await this.finishSendBtn).click()
  }
}

export default new CheckYourAnswersPage()
