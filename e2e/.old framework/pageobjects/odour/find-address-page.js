import OdourBasePage from './odour-base-page.js'

export default class FindAddress extends OdourBasePage {
  get buildingNumberOrName () { return $('#buildingDetails') }

  get postcode () { return $('#postcode') }

  async enterBuildingNumberOrName (text) {
    await (await this.buildingNumberOrName).waitForDisplayed({})
    await (await this.buildingNumberOrName).setValue(text)
  }

  async enterPostcode (text) {
    await (await this.postcode).waitForDisplayed({})
    await (await this.postcode).setValue(text)
  }
}
