import radioButtonUtils from '../utilities/radiobuttons/radio-buttons.js'
import checkButtonUtils from '../utilities/checkbuttons/check-buttons.js'
import dateTimeUtils from '../utilities/date-time/date-time.js'

import signInPage from '../pageobjects/sign_in.page.js'
import LandingPage from '../pageobjects/landing-page.js'
import contactDetailsPage from '../pageobjects/contact-details-page.js'
import startPage from '../pageobjects/start-page.js'
import sourcePage from '../pageobjects/water-pollution/pollution-source.page.js'
import locationOptionPage from '../pageobjects/water-pollution/location-option.page.js'
import locationMapPage from '../pageobjects/water-pollution/location-map.page.js'
import startDateTimePage from '../pageobjects/water-pollution/start-date-time.page.js'
import ThinkPollutionIs from '../pageobjects/water-pollution/pollution-is.page.js'
import PollutionLooklike from '../pageobjects/water-pollution/pollution-looklike.page.js'
import locationDescriptionPage from '../pageobjects/water-pollution/location-description.page.js'
import PollutionComingFrom from '../pageobjects/water-pollution/pollution-coming-from.page.js'
import ImagesOrVideoPage from '../pageobjects/water-pollution/images-or-video-page.js'
import LessThanTenPage from '../pageobjects/water-pollution/less-than-10.page.js'
import PollutionLength from '../pageobjects/water-pollution/pollution-length.page.js'
import DeadFishPage from '../pageobjects/water-pollution/dead-fish-page.js'
import contactPage from '../pageobjects/water-pollution/contact-page.js'
import OtherInformationPage from '../pageobjects/water-pollution/other-information.page.js'
import CheckYourAnswersPage from '../pageobjects/water-pollution/check-your-answers.page.js'

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const WaterPollutionJourney = {

  async signInAsWPInternalUser () {
    await signInPage.enterName('John Smith')
    await signInPage.enterPhone('012345678901')
    await signInPage.enterAccessCode(process.env.WP_ACCESS_CODE)
    await signInPage.enterEmail('autotest@gmail.com')
    await sleep(1000)
    await signInPage.clickSignIn()
  },

  async gotoWaterPollutionReport () {
    await LandingPage.clickWaterPollutionLink()
  },

  async startNow () {
    await expect(await startPage.getHeading()).toContain('Report water pollution')
    await startPage.clickStartNow()
  },
  async verifySourcePage () {
    await expect(browser).toHaveTitle('In what kind of water is the pollution? - report water pollution in England - GOV.UK')
    await expect(await sourcePage.getHeading()).toContain('In what kind of water is the pollution?')
    await sourcePage.clickContinue()
    const errorSummary = await sourcePage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select a type of watercourse or feature, or you do not know')
    await expect(await sourcePage.getAnswerIDError()).toContain('Select a type of watercourse or feature, or you do not know')
  },

  async selectSourceDetails (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    if (radioButtonOption === 5) {
      sourcePage.fillSomethingElseDetails('Auto Test River')
    }
    await sourcePage.clickContinue()
  },

  async completeLocationOption (radioButtonOption) {
    await sleep(1000)
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await sleep(1000)
    await locationOptionPage.clickContinue()
    await sleep(1000)
    if (radioButtonOption === 0) {
      await expect(browser).toHaveTitle('Mark the location of the pollution - report an environmental problem - GOV.UK')
      await expect(await locationMapPage.getHeading()).toContain('Mark the location of the pollution')
      await sleep(2000)
      locationMapPage.enterLocation('Manchester')
      await sleep(2000)
      locationMapPage.clickSearch()
      await sleep(5000)
      locationMapPage.clickMap()
      await sleep(3000)
      locationMapPage.clickMap()
      await sleep(3000)
      await locationMapPage.clickContinue()
    } else if (radioButtonOption === 1) {
      await expect(browser).toHaveTitle('Where is the pollution - report an environmental problem - GOV.UK')
      await expect(await locationDescriptionPage.getHeading()).toContain('Where is the pollution?')
      await locationDescriptionPage.enterLocationDescription('Auto Test Location Description.')
      await locationMapPage.clickContinue()
    }
  },

  async verifyStartDateTimePage () {
    await expect(browser).toHaveTitle('When did you see the pollution - report an environmental problem - GOV.UK')
    await expect(await startDateTimePage.getHeading()).toContain('When did you see the pollution?')
    await startDateTimePage.clickContinue()
    const errorSummary = await startDateTimePage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select when you saw the pollution')
    await expect(await startDateTimePage.getCurrentIDError()).toContain('Select when you saw the pollution')
  },

  async selectStartDateTime (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    const dateTime = await dateTimeUtils.generateCurrentDatePastTime(5)
    await sleep(2000)
    if (radioButtonOption === 2) {
      await startDateTimePage.enterDay(dateTime.day)
      await sleep(1000)
      await startDateTimePage.enterMonth(dateTime.month)
      await sleep(1000)
      await startDateTimePage.enterYear(dateTime.year)
      await sleep(2000)
    }
    await startDateTimePage.enterHour(dateTime.hour, radioButtonOption)
    await sleep(1000)
    await startDateTimePage.enterMinute(dateTime.minute, radioButtonOption)
    await sleep(2000)
    await startDateTimePage.enterPeriod(dateTime.period, radioButtonOption)
    await sleep(2000)
    await startDateTimePage.clickContinue()
  },

  async verifyThinkPollutionIsPage () {
    await expect(browser).toHaveTitle('What do you think the pollution is - report an environmental problem - GOV.UK')
    await expect(await ThinkPollutionIs.getHeading()).toContain('What do you think the pollution is?')
  },

  async selectThinkPollutionIs (checkboxOption) {
    await checkButtonUtils.getAndSelectCheckbox(checkboxOption)
    if (checkboxOption === 4) {
      await sleep(2000)
      await ThinkPollutionIs.fillSomethingElseDetails('Auto Test SomethingElse')
    }
    await ThinkPollutionIs.clickContinue()
  },

  async verifyTPollutionLooklikePage () {
    await expect(browser).toHaveTitle('What does the pollution look like - report an environmental problem - GOV.UK')
    await expect(await PollutionLooklike.getHeading()).toContain('What does the pollution look like?')
  },

  async selectPollutionLooklike (checkboxOption) {
    await checkButtonUtils.getAndSelectCheckbox(checkboxOption)
    await PollutionLooklike.clickContinue()
  },

  async verifyPollutionComingFrom () {
    await expect(browser).toHaveTitle('Do you know where the pollution is coming from - report an environmental problem - GOV.UK')
    await expect(await PollutionComingFrom.getHeading()).toContain('Do you know where the pollution is coming from?')
    await PollutionComingFrom.clickContinue()
    const errorSummary = await PollutionComingFrom.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Answer yes if you know where the pollution is coming from')
    await expect(await PollutionComingFrom.getAnswerIDError()).toContain('Answer yes if you know where the pollution is coming from')
  },

  async selectPollutionComingFrom (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    if (radioButtonOption === 0) {
      PollutionComingFrom.enterYesDetails('Auto Test from')
    }
    await PollutionComingFrom.clickContinue()
  },

  async verifyImageOrVideoPage () {
    await expect(browser).toHaveTitle('Do you want to send us any images or videos of the pollution - report an environmental problem - GOV.UK')
    await expect(await ImagesOrVideoPage.getHeading()).toContain('Do you want to send us any images or videos of the pollution?')
    await ImagesOrVideoPage.clickContinue()
    const errorSummary = await ImagesOrVideoPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if you want to send us any images or videos')
    await expect(await ImagesOrVideoPage.getAnswerIDError()).toContain('Select yes if you want to send us any images or videos')
  },

  async selectImagesOrVideo (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await ImagesOrVideoPage.clickContinue()
  },
  async verifyLessThan10Page () {
    await expect(browser).toHaveTitle('Does the pollution spread less than 10 metres - report an environmental problem - GOV.UK')
    await expect(await LessThanTenPage.getHeading()).toContain('Does the pollution spread less than 10 metres along the river?')
    await LessThanTenPage.clickContinue()
    const errorSummary = await LessThanTenPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if the pollution spreads less than 10 metres')
    await expect(await LessThanTenPage.getAnswerIDError()).toContain('Select yes if the pollution spreads less than 10 metres')
  },

  async selectLessThan10Page (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await LessThanTenPage.clickContinue()
  },

  async selectPollutionLength (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    await PollutionLength.clickContinue()
  },

  async verifyDeadFishPage () {
    await expect(browser).toHaveTitle('Have you seen any dead or distressed fish or animals nearby - report an environmental problem - GOV.UK')
    await expect(await DeadFishPage.getHeading()).toContain('Have you seen any dead or distressed fish or animals nearby?')
    await DeadFishPage.clickContinue()
    const errorSummary = await DeadFishPage.getErrorSummary()
    await expect(errorSummary).toContain('There is a problem')
    await expect(errorSummary).toContain('Select yes if you\'ve seen dead or distressed fish or other animals nearby')
    await expect(await DeadFishPage.getAnswerIDError()).toContain('Select yes if you\'ve seen dead or distressed fish or other animals nearby')
  },

  async selectDeadFishPage (radioButtonOption) {
    await radioButtonUtils.getAndSelectRadioButton(radioButtonOption)
    if (radioButtonOption === 0) {
      await sleep(2000)
      await DeadFishPage.enterYesDetails('Auto Test Fish')
    }
    await sleep(2000)
    await DeadFishPage.clickContinue()
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

  async verifyOtherInformationPage () {
    await expect(browser).toHaveTitle("Is there anything else you'd like to add - report an environmental problem - GOV.UK")
    await expect(await OtherInformationPage.getHeading()).toContain("Is there anything else you'd like to add (optional)?")
  },

  async fillOptionalInformation (text = 'AUTO TEST') {
    await OtherInformationPage.enterOtherInfo(text)
    await OtherInformationPage.clickContinue()
  },

  async verifyCheckYourAnswerPage () {
    await expect(browser).toHaveTitle('Check your answers before sending your report - report an environmental problem - GOV.UK')
    await expect(await CheckYourAnswersPage.getHeading()).toContain('Check your answers before sending your report')
  },

  async SendReport () {
    await CheckYourAnswersPage.clickFinishAndSendReport()
  }

}

export default WaterPollutionJourney
