import WaterPollutionBasePage from './water-pollution-base.page.js'

class LocationMap extends WaterPollutionBasePage {
  // LOCATORS
  get map () { return $('[id="map"]') }
  get textBox () { return $('#location') }
  get searchButton () { return $('#search-location') }
  get mapCanvas () { return $('#map canvas') }

  async enterLocation (text) {
    await (await this.textBox).waitForDisplayed({})
    await (await this.textBox).setValue(text)
  }

  async clickSearch () {
    await (await this.searchButton).waitForDisplayed({})
    await (await this.searchButton).click()
  }

  async clickMap () {
    await this.map.waitForDisplayed({ timeout: 5000 })
    await this.map.click()
    const isIOS = (browser.capabilities.deviceName || '').toLowerCase().includes('iphone')
    console.log('isIOS:', isIOS, 'browser.capabilities.deviceName:', browser.capabilities.deviceName)
    if (isIOS) {
      const canvas = await $('#map canvas')
      await canvas.waitForDisplayed({ timeout: 5000 })

      const rect = await canvas.getRect()
      const centerX = Math.floor(rect.x + rect.width / 2)
      const centerY = Math.floor(rect.y + rect.height / 2)

      await browser.touchAction([
        { action: 'press', x: centerX, y: centerY },
        { action: 'release' }
      ])

      await browser.pause(1000) // Let map register the click
    } else {
      await this.map.click()
    }
  }
}

export default new LocationMap()
