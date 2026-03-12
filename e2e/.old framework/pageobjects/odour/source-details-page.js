import OdourBasePage from './odour-base-page.js'

class SourceDetails extends OdourBasePage {
  // LOCATORS
  get nameOfPersonOrSite () { return $('#siteName') }
  get streetNameAndNumber () { return $('#sourceAddress') }
  get townOrCity () { return $('#sourceTown') }
  get postCode () { return $('#sourcePostcode') }
  get nameOfPersonOrSiteError () { return $('[id="siteName-error"]') }
  get townOrCityError () { return $('[id="sourceTown-error"]') }

  async enterNameOfPersonOrSite (text) {
    await (await this.nameOfPersonOrSite).waitForDisplayed({})
    await (await this.nameOfPersonOrSite).setValue(text)
  }

  async enterStreetNameAndNumber (text) {
    await (await this.streetNameAndNumber).waitForDisplayed({})
    await (await this.streetNameAndNumber).setValue(text)
  }

  async enterTownOrCity (text) {
    await (await this.townOrCity).waitForDisplayed({})
    await (await this.townOrCity).setValue(text)
  }

  async enterPostcode (text) {
    await (await this.postCode).waitForDisplayed({})
    await (await this.postCode).setValue(text)
  }

  async getNameOfPersonOrSiteError () {
    await (await this.nameOfPersonOrSiteError).waitForDisplayed()
    return (await this.nameOfPersonOrSiteError).getText()
  }

  async getTownOrCityError () {
    await (await this.townOrCityError).waitForDisplayed()
    return (await this.townOrCityError).getText()
  }
}

export default new SourceDetails()
