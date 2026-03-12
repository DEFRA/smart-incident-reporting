import OdourJourney from '../actions/odour_actions.js'
import SignInActions from '../actions/sign_in_actions.js'
import Authentication from '../utilities/dataverse/authentication/authentication.js'

const epochTime = Math.floor(Date.now() / 1000)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

describe('Odour E2E Tests @e2e_robotics @regression', () => {
  before(async () => {
    await browser.url('/')
    await SignInActions.handleCookies()
  })

  it('Robotics Odour Journey - E2E Test-2', async () => {
    console.log('Starting Robotics Odour Journey Test...')

    await browser.url('/')
    await OdourJourney.gotoOdourReport()
    await OdourJourney.startNow()
    await sleep(2000)
    await OdourJourney.selectSource(0)
    await OdourJourney.selectSourceDetails(0)
    await sleep(2000)
    await OdourJourney.selectLocationHome(0)
    await OdourJourney.fillFindAddress()
    await sleep(2000)
    await OdourJourney.selectRadioButtonsOption('Ghyll Mount')
    await OdourJourney.confirmAddress()
    await sleep(2000)
    await OdourJourney.selectPreviousOption(0)
    await sleep(2000)
    await OdourJourney.selectStartDateTime(0)
    await OdourJourney.selectIsSmellStillThere(0)
    await OdourJourney.selectSmellStrength(0)
    await OdourJourney.selectSmellNoticeableIndoors(0)
    await OdourJourney.selectSmellStickToClothsAndHair(0)
    await OdourJourney.selectEffectOnDailyLife(0)
    await OdourJourney.selectEffectOnHealth(0)
    await OdourJourney.selectMedicalHelp(0)
    await OdourJourney.selectContact(0)
    await OdourJourney.fillContactDetailsPage()
    await sleep(2000)
    await OdourJourney.selectImagesOrVideo(0)
    await OdourJourney.fillOptionalInformation(`Auto Test Odour ${epochTime}`)

    console.log('Waiting 2 minutes before checking Dataverse...')
    await sleep(12000)

    console.log('Fetching report data from Dataverse...')
    const auth = new Authentication()

    if (!process.env.DYNAMICS_URL) {
      throw new Error('DYNAMICS_URL environment variable is missing.')
    }

    const tenMinutesAgo = new Date(Date.now() - 200 * 60000)
    const formattedDate = tenMinutesAgo.toISOString().slice(0, 19) + 'Z'
    const dataverseQueryUrl = `https://${process.env.DYNAMICS_URL}/api/data/v9.2/sbs_reports?$filter=modifiedon ge ${formattedDate} and contains(sbs_reportdescription, 'Auto Test Odour ${epochTime}')`

    console.log(`Dataverse Query URL: ${dataverseQueryUrl}`)

    let sbsReportId
    try {
      const token = await auth.authenticate()
      sbsReportId = await auth.fetchDataVerse(token, dataverseQueryUrl)
    } catch (error) {
      console.error('Error fetching data from Dataverse:', error)
      return
    }

    if (!sbsReportId) {
      console.error('No report found in Dataverse.')
      return
    }

    console.log(`REPORT ID: ${sbsReportId}`)

    const powerAppsUrl = `https://apps.powerapps.com/play/e/3cb8483f-3c2a-e021-862d-c9f253ee34a6/a/aa3c07ab-1712-4075-a7f6-d7baccde4c3a?hidenavbar=true&ReportID=${sbsReportId}`
    console.log(`POWER APPS URL: ${powerAppsUrl}`)

    // Update browser base URL and navigate
    browser.options.baseUrl = powerAppsUrl
    await browser.url('/')

    // console.log("Waiting 2 minutes before finalizing...");
    // await sleep(120000);
  })
})
