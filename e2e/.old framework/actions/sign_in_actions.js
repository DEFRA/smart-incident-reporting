import cookiesBanner from '../pageobjects/cookies-banner-page.js'
import signInPage from '../pageobjects/sign_in.page.js'
import startPage from '../pageobjects/start-page.js'

const SignInActions = {

  async handleCookies () {
    await cookiesBanner.clickRejectCookies()
    await cookiesBanner.clickHideCookies()
  },

  async signInWithAccessCode (accessCode) {
    await signInPage.enterName('John Smith')
    await signInPage.enterPhone('012345678901')
    await signInPage.enterEmail('autotest@gmail.com')
    await signInPage.enterAccessCode(accessCode)
    await signInPage.clickSignIn()
  },

  async startNow () {
    await expect(await startPage.getHeading()).toContain('Report a smell')
    await startPage.clickStartNow()
  },
}

export default SignInActions
