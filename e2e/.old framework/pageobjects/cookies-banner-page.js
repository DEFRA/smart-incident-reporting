class CookiesBannerPage {
  // LOCATORS
  get rejectCookies () { return $('.govuk-button.js-cookies-button-reject') }
  get hideCookies () { return $('button.govuk-button.js-hide') }
  get cookiesBanner () { return $('.govuk-cookie-banner__heading') }

  async clickRejectCookies () {
    await (await this.rejectCookies).waitForDisplayed({})
    return (await this.rejectCookies).click()
  }

  async clickHideCookies () {
    const hideCookiesButton = await this.hideCookies
    await hideCookiesButton.scrollIntoView()
    await browser.execute((button) => button.click(), hideCookiesButton)
  }

  async cookiesBannerVisible () {
    try {
      await (await this.cookiesBanner).waitForDisplayed({ timeout: 1000 })
      return await (await this.cookiesBanner).isDisplayed()
    } catch (error) {
      return false // Return false if the cookie banner is not present
    }
  }
}

export default new CookiesBannerPage()
