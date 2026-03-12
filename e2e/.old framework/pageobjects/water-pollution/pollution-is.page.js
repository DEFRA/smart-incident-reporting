import WaterPollutionBasePage from './water-pollution-base.page.js'

class ThinkPollutionIs extends WaterPollutionBasePage {
  get SomethingElseDetail () { return $('#somethingElseDetail') }

  async fillSomethingElseDetails (text) {
    await (await this.SomethingElseDetail).waitForDisplayed({})
    await (await this.SomethingElseDetail).setValue(text)
  }
}

export default new ThinkPollutionIs()
