import WaterPollutionBasePage from './water-pollution-base.page.js'

class LocationDescription extends WaterPollutionBasePage {
  // LOCATORS
  get locationDescriptionTextBox () { return $('[id="locationDescription"]') }

  async enterLocationDescription (text) {
    await (await this.locationDescriptionTextBox).waitForDisplayed({})
    await (await this.locationDescriptionTextBox).setValue(text)
  }
}

export default new LocationDescription()
