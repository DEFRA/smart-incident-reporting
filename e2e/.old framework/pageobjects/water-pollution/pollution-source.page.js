import WaterPollutionBasePage from './water-pollution-base.page.js'

class SourcePage extends WaterPollutionBasePage {
  get SomethingElseDescritpion () { return $('[name="somethingElseDetails"]') }

  async fillSomethingElseDetails (text) {
    await (await this.SomethingElseDescritpion).waitForDisplayed({})
    await (await this.SomethingElseDescritpion).setValue(text)
  }
}

export default new SourcePage()
