import radioButtonUtils from '../utilities/radiobuttons/radio-buttons.js'
import checkButtonUtils from '../utilities/checkbuttons/check-buttons.js'
import dateTimeUtils from '../utilities/date-time/date-time.js'

import signInPage from '../pageobjects/sign_in.page.js'
import landingPage from '../pageobjects/landing-page.js'
import contactDetailsPage from '../pageobjects/contact-details-page.js'
import startPage from '../pageobjects/start-page.js'
import sourcePage from '../pageobjects/odour/source-page.js'
import sourceDetailsPage from '../pageobjects/odour/source-details-page.js'
import locationHomePage from '../pageobjects/odour/location-home-page.js'
import findAddressPage from '../pageobjects/odour/find-address-page.js'
import locationOptionPage from '../pageobjects/odour/location-option-page.js'
import locationMapPage from '../pageobjects/odour/location-map-page.js'
import locationDescriptionPage from '../pageobjects/odour/location-description-page.js'

import previousPage from '../pageobjects/odour/previous-page.js'
import startDateTimePage from '../pageobjects/odour/start-date-time-page.js'
import currentPage from '../pageobjects/odour/current-page.js'
import smellStrengthPage from '../pageobjects/odour/smell-strength-page.js'
import indoorsPage from '../pageobjects/odour/indoors-page.js'
import clothingAndHairPage from '../pageobjects/odour/clothing-and-hair-page.js'
import effectOnDailyLifePage from '../pageobjects/odour/effect-on-daily-life-page.js'
import effectOnHealthPage from '../pageobjects/odour/effect-on-health-page.js'
import medicalHelpPage from '../pageobjects/odour/medical-help-page.js'
import contactPage from '../pageobjects/odour/contact-page.js'
import imageOrVideoPage from '../pageobjects/odour/image-or-video-page.js'
import otherInformationPage from '../pageobjects/odour/other-information-page.js'
import reportSentPage from '../pageobjects/odour/report-sent-page.js'
import chooseAddressPage from '../pageobjects/odour/choose-address-page.js'
import confirmAddressPage from '../pageobjects/odour/confirm-address-page.js'

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const OdourJourney = {

  async signInAsOdourInternalUser () {
    await signInPage.enterName('John Smith')
    await signInPage.enterPhone('012345678901')
    await signInPage.enterAccessCode(process.env.ODOUR_ACCESS_CODE)
    await signInPage.enterEmail('autotest@gmail.com')
    await sleep(1000)
    await signInPage.clickSignIn()
  },

  async gotoOdourReport () {
    await landingPage.clickOdourLink()
  },

  async startNow () {
    await expect(await startPage.getHeading()).toContain('Report a smell')
    await startPage.clickStartNow()
  },

  async verifySourcePage () {
    await expect(browser).toHaveTitle('Where is the smell coming from - report a smell from a waste facility, industrial site or farm in England - GOV.UK')
    await expect(await sourcePage.getHeading()).toContain('Where is the smell coming from?')
    await sourcePage.clickContinue()
    const errorSummary = await sourcePage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select a type of place or activity where the smell is coming from')
    await expect(await sourcePage.getAnswerIDError()).toContain('Select a type of place or activity where the smell is coming from')
  },

  async verifySourcePageTitle (title) {
    await sleep(2000)
    await expect(browser).toHaveTitle(title)
  },

  async selectSource (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await sourcePage.clickContinue()
  },

  async verifyReportLocalCouncil () {
    await expect(browser).toHaveTitle('Report the smell to your local council - report an environmental problem - GOV.UK')
    await expect(await sourcePage.getHeading()).toContain('Report the smell to your local council')
  },

  async verifyContactLocalCouncil () {
    await expect(browser).toHaveTitle('Contact your local council about the smell - report an environmental problem - GOV.UK')
    await expect(await sourcePage.getHeading()).toContain('Contact your local council about the smell')
  },

  async verifySourceDetailsPage (radioButtonOption) {
    await expect(browser).toHaveTitle('Can you give details about where the smell is coming from - report an environmental problem - GOV.UK')
    await expect(await sourceDetailsPage.getHeading()).toContain('Can you give details about where the smell is coming from?')
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await sourceDetailsPage.clickContinue()
    const errorSummary = await sourceDetailsPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Enter a name')
    await expect(errorSummary).toContain('Enter a town or city')
    await expect(await sourceDetailsPage.getNameOfPersonOrSiteError()).toContain('Enter a name')
    await expect(await sourceDetailsPage.getTownOrCityError()).toContain('Enter a town or city')
  },

  async selectSourceDetails (radioButtonOption) {
    await sleep(2000)
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await sleep(2000)
    if (radioButtonOption === 0) {
      await sourceDetailsPage.enterNameOfPersonOrSite('odourPersonOrSite')
      await sourceDetailsPage.enterStreetNameAndNumber('odourStreet')
      await sourceDetailsPage.enterTownOrCity('odourTownCity')
      await sourceDetailsPage.enterPostcode('TE1 2ST')
    }
    await sourceDetailsPage.clickContinue()
  },

  async completeLocationOption (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await locationOptionPage.clickContinue()
    if (radioButtonOption === 0) {
      await expect(browser).toHaveTitle('Mark the location of the smell - report an environmental problem - GOV.UK')
      await expect(await locationHomePage.getHeading()).toContain('Mark the location of the smell')
      await sleep(2000)
      locationMapPage.enterLocation('Manchester')
      await sleep(2000)
      locationMapPage.clickSearch()
      await sleep(5000)
      locationMapPage.clickMap()
      await sleep(2000)
      await locationMapPage.clickContinue()
    } else if (radioButtonOption === 1) {
      await expect(browser).toHaveTitle('Describe the location where you noticed the smell - report an environmental problem - GOV.UK')
      await expect(await locationHomePage.getHeading()).toContain('Describe the location where you noticed the smell')
      await locationDescriptionPage.enterLocationDescription('Auto Test Location Description.')
      await locationMapPage.clickContinue()
    }
  },

  async verifyLocationHomePage () {
    await expect(browser).toHaveTitle('Is the smell affecting you at home - report an environmental problem - GOV.UK')
    await expect(await locationHomePage.getHeading()).toContain('Is the smell affecting you at home?')
    await locationHomePage.clickContinue()
    const errorSummary = await locationHomePage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if the smell is affecting you at home')
    await expect(await locationHomePage.getAnswerIDError()).toContain('Select yes if the smell is affecting you at home')
  },

  async selectLocationHome (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await locationHomePage.clickContinue()
  },

  async fillFindAddress () {
    await findAddressPage.enterBuildingNumberOrName('40 Businnes Park')
    await findAddressPage.enterPostcode('CA11 9BP')
    await findAddressPage.clickContinue()
  },

  async selectRadioButtonsOption (radioButtonText) {
    await sleep(2000)
    await radioButtonUtils.selectRadioButtonByText(radioButtonText)
    await sleep(2000)
    await chooseAddressPage.clickContinue()
  },

  async confirmAddress () {
    await confirmAddressPage.clickContinue()
  },

  async verifyPreviousPage () {
    await expect(browser).toHaveTitle('Has this smell caused you problems before - report an environmental problem - GOV.UK')
    await expect(await previousPage.getHeading()).toContain('Has this smell caused you problems before?')
    await previousPage.clickContinue()
    const errorSummary = await previousPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if the smell has caused you a problem before')
    await expect(await previousPage.getAnswerIDError()).toContain('Select yes if the smell has caused you a problem before')
  },

  async selectPreviousOption (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await previousPage.clickContinue()
  },

  async verifyStartDateTimePage () {
    await expect(browser).toHaveTitle('When did the smell start, on this occasion - report an environmental problem - GOV.UK')
    await expect(await startDateTimePage.getHeading()).toContain('When did the smell start, on this occasion?')
    await startDateTimePage.clickContinue()
    const errorSummary = await startDateTimePage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select when the smell started')
    await expect(await startDateTimePage.getCurrentIDError()).toContain('Select when the smell started')
  },

  async selectStartDateTime (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    const dateTime = await dateTimeUtils.generateCurrentDatePastTime(5)
    await sleep(3000)
    if (radioButtonOption === 2) {
      await startDateTimePage.enterDay(dateTime.day)
      await startDateTimePage.enterMonth(dateTime.month)
      await startDateTimePage.enterYear(dateTime.year)
    }
    await startDateTimePage.enterHour(dateTime.hour, radioButtonOption)
    await startDateTimePage.enterMinute(dateTime.minute, radioButtonOption)
    await startDateTimePage.enterPeriod(dateTime.period, radioButtonOption)
    await startDateTimePage.clickContinue()
  },

  async verifyIsSmellStillTherePage () {
    await expect(browser).toHaveTitle('Is the smell still there - report an environmental problem - GOV.UK')
    await expect(await currentPage.getHeading()).toContain('Is the smell still there?')
    await currentPage.clickContinue()
    const errorSummary = await currentPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if the smell is still there')
    await expect(await currentPage.getAnswerIDError()).toContain('Select yes if the smell is still there')
  },

  async selectIsSmellStillThere (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await currentPage.clickContinue()
  },

  async verifySmellStrengthPage () {
    await expect(browser).toHaveTitle('How strong is the smell - report an environmental problem - GOV.UK')
    await expect(await smellStrengthPage.getHeading()).toContain('How strong is the smell?')
    await currentPage.clickContinue()
    const errorSummary = await currentPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select how strong the smell is')
    await expect(await currentPage.getAnswerIDError()).toContain('Select how strong the smell is')
  },

  async selectSmellStrength (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await smellStrengthPage.clickContinue()
  },

  async verifySmellNoticeableIndoorsPage () {
    await expect(browser).toHaveTitle('Is the smell noticeable indoors - report an environmental problem - GOV.UK')
    await expect(await indoorsPage.getHeading()).toContain('Is the smell noticeable indoors?')
    await indoorsPage.clickContinue()
    const errorSummary = await indoorsPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if the smell is noticeable indoors')
    await expect(await indoorsPage.getAnswerIDError()).toContain('Select yes if the smell is noticeable indoors')
  },

  async selectSmellNoticeableIndoors (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await indoorsPage.clickContinue()
  },

  async verifySmellStickToClothsAndHairPage (smellNoticeable) {
    if (smellNoticeable === 0) {
      await expect(browser).toHaveTitle('Does the smell stick to your clothing or hair - report an environmental problem - GOV.UK')
      await expect(await clothingAndHairPage.getHeading()).toContain('Does the smell stick to your clothing or hair?')
      await clothingAndHairPage.clickContinue()
      const errorSummary = await clothingAndHairPage.getErrorSummary()
      await expect(errorSummary).toContain('There is a problem')
      await expect(errorSummary).toContain('Select yes if the smell sticks to your clothing or hair')
      await expect(await clothingAndHairPage.getAnswerIDError()).toContain('Select yes if the smell sticks to your clothing or hair')
    } else if (smellNoticeable === 1) {
      await expect(browser).toHaveTitle('Did the smell stick to your clothing or hair - report an environmental problem - GOV.UK')
      await expect(await clothingAndHairPage.getHeading()).toContain('Did the smell stick to your clothing or hair?')
      await clothingAndHairPage.clickContinue()
      const errorSummary = await clothingAndHairPage.getErrorSummary()
      await expect(errorSummary).toContain('There is a problem')
      await expect(errorSummary).toContain('Select yes if the smell stuck to your clothing or hair')
      await expect(await clothingAndHairPage.getAnswerIDError()).toContain('Select yes if the smell stuck to your clothing or hair')
    }
  },

  async selectSmellStickToClothsAndHair (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await clothingAndHairPage.clickContinue()
  },

  async verifyEffectOnDailyLifePage () {
    await expect(browser).toHaveTitle('Did you do any of the following because of the smell - report an environmental problem - GOV.UK')
    await expect(await effectOnDailyLifePage.getHeading()).toContain('Did you do any of the following because of the smell?')
  },

  async selectEffectOnDailyLife (checkboxOption) {
    await checkButtonUtils.getAndSelectCheckbox(checkboxOption)
    await effectOnDailyLifePage.clickContinue()
  },

  async verifyEffectOnHealthPage () {
    await expect(browser).toHaveTitle('Did the smell cause any of these health problems, on this occasion - report an environmental problem - GOV.UK')
    await expect(await effectOnHealthPage.getHeading()).toContain('Did the smell cause any of these health problems, on this occasion?')
  },

  async selectEffectOnHealth (checkboxOption) {
    await checkButtonUtils.getAndSelectCheckbox(checkboxOption)
    await effectOnHealthPage.clickContinue()
  },

  async verifyMedicalHelpPage () {
    await expect(browser).toHaveTitle('Have you had to get any medical help because of the smell - report an environmental problem - GOV.UK')
    await expect(await medicalHelpPage.getHeading()).toContain('Have you had to get any medical help because of the smell?')
    await medicalHelpPage.clickContinue()
    const errorSummary = await medicalHelpPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if you had to get any medical help because of the smell')
    await expect(await medicalHelpPage.getAnswerIDError()).toContain('Select yes if you had to get any medical help because of the smell')
  },

  async selectMedicalHelp (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await medicalHelpPage.clickContinue()
  },

  async verifyContactPage () {
    await expect(browser).toHaveTitle('Can we contact you for more information if needed - report an environmental problem - GOV.UK')
    await expect(await contactPage.getHeading()).toContain('Can we contact you for more information if needed?')
    await contactPage.clickContinue()
    const errorSummary = await contactPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if we can contact you')
    await expect(await contactPage.getAnswerIDError()).toContain('Select yes if we can contact you')
  },

  async selectContact (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await contactPage.clickContinue()
  },

  async verifyContactDetailsPage () {
    await expect(browser).toHaveTitle('Enter your contact details - report an environmental problem - GOV.UK')
    await expect(await contactDetailsPage.getHeading()).toContain('Enter your contact details')
    await contactDetailsPage.clickContinue()
    const errorSummary = await contactDetailsPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Enter your name')
    await expect(errorSummary).toContain('Enter a phone number')
    await expect(errorSummary).toContain('Enter an email address in the correct format, like name@example.com')
  },

  async fillContactDetailsPage () {
    await contactDetailsPage.enterName('John Smith')
    await contactDetailsPage.enterPhone('012345678901')
    await contactDetailsPage.enterEmail('autotest@gmail.com')
    await contactDetailsPage.clickContinue()
  },

  async verifyImageOrVideoPage () {
    await expect(browser).toHaveTitle('Do you want to send us any images or videos of the problem - report an environmental problem - GOV.UK')
    await expect(await imageOrVideoPage.getHeading()).toContain('Do you want to send us any images or videos of the problem?')
    await imageOrVideoPage.clickContinue()
    const errorSummary = await contactPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if you want to send us any images or videos')
    await expect(await imageOrVideoPage.getAnswerIDError()).toContain('Select yes if you want to send us any images or videos')
  },

  async selectImagesOrVideo (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await imageOrVideoPage.clickContinue()
  },

  async verifyOtherInformationPage () {
    await expect(browser).toHaveTitle("Is there anything else you'd like to add - report an environmental problem - GOV.UK")
    await expect(await otherInformationPage.getHeading()).toContain("Is there anything else you'd like to add (optional)?")
  },

  async fillOtherInformation () {
    await sleep(3000)
    await otherInformationPage.enterOtherInfo('Test Other Information')
    await otherInformationPage.clickSendReport()
  },

  async fillOptionalInformation (text) {
    await otherInformationPage.enterOtherInfo(text)
    await otherInformationPage.clickSendReport()
  },

  async verifyReportSent () {
    await expect(browser).toHaveTitle('Report received - report an environmental problem - GOV.UK')
    await expect(await reportSentPage.getHeading()).toContain('Report sent')
  }

}

export default OdourJourney
