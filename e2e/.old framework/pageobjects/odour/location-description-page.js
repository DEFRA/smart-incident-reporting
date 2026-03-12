import OdourBasePage from './odour-base-page.js'

class LocationDescription extends OdourBasePage {
  // LOCATORS
  get locationDescriptionTextBox () {
    return $('[id="locationDescription"]')
  }

  async enterLocationDescription (text) {
    await (await this.locationDescriptionTextBox).waitForDisplayed({})
    await (await this.locationDescriptionTextBox).setValue(text)
  }
}

export default new LocationDescription()
