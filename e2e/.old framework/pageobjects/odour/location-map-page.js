import OdourBasePage from './odour-base-page.js'

class LocationMap extends OdourBasePage {
  // LOCATORS
  get map () { return $('[id="map"]') }
  get textBox () { return $('#location') }
  get searchButton () { return $('#search-location') }

  async enterLocation (text) {
    await (await this.textBox).waitForDisplayed({})
    await (await this.textBox).setValue(text)
  }

  async clickSearch () {
    await (await this.searchButton).waitForDisplayed({})
    await (await this.searchButton).click()
  }

  async clickMap () {
    await (await this.map).waitForDisplayed({})
    await (await this.map).click()
  }
}

export default new LocationMap()
