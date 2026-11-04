import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const sites = [
  { id: 'EPR/AB1234CD', name: 'Acme Waste Ltd', address: '1, Industrial Estate, Testtown, TE1 0ST', distance: 0.1 },
  { id: 'WEX123456', name: 'Testco Recycling', address: '', distance: 1.2 }
]

const baseSession = {
  [constants.redisKeys.RARS_CONFIRM_ADDRESS]: {
    selectedAddress: [{ postcode: 'TE1 0ST', address: 'Test House, Testtown, TE1 0ST', x: 365739, y: 343015 }]
  },
  [constants.redisKeys.RARS_NEARBY_SITES]: sites
}

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_CHOOSE_SITE, changeAddress: constants.routes.SMELL_LOCATION_HOME, manualSite: constants.routes.SMELL_SOURCE_DETAILS, confirmSite: constants.routes.SMELL_CONFIRM_SITE },
  { problem: 'noise', url: constants.routes.NOISE_CHOOSE_SITE, changeAddress: constants.routes.NOISE_LOCATION_HOME, manualSite: constants.routes.NOISE_SOURCE_DETAILS, confirmSite: constants.routes.NOISE_CONFIRM_SITE },
  { problem: 'dust', url: constants.routes.DUST_CHOOSE_SITE, changeAddress: constants.routes.DUST_LOCATION_HOME, manualSite: constants.routes.DUST_SOURCE_DETAILS, confirmSite: constants.routes.DUST_CONFIRM_SITE },
  { problem: 'litter', url: constants.routes.LITTER_CHOOSE_SITE, changeAddress: constants.routes.LITTER_LOCATION_HOME, manualSite: constants.routes.LITTER_SOURCE_DETAILS, confirmSite: constants.routes.LITTER_CONFIRM_SITE },
  { problem: 'mud', url: constants.routes.MUD_CHOOSE_SITE, changeAddress: constants.routes.MUD_LOCATION_HOME, manualSite: constants.routes.MUD_SOURCE_DETAILS, confirmSite: constants.routes.MUD_CONFIRM_SITE },
  { problem: 'vermin/pests', url: constants.routes.PESTS_CHOOSE_SITE, changeAddress: constants.routes.PESTS_LOCATION_HOME, manualSite: constants.routes.PESTS_SOURCE_DETAILS, confirmSite: constants.routes.PESTS_CONFIRM_SITE }
]

describe('RARS Choose Site Routes', () => {
  describe.each(problems)('$problem choose site', ({ url, changeAddress, manualSite, confirmSite }) => {
    describe('GET', () => {
      it('Happy: lists nearby sites', async () => {
        const response = await submitGetRequest({ url }, 'Choose the site you want to report', constants.statusCodes.OK, baseSession)
        expect(response.payload).toContain('<b>2</b> addresses found within <b>3 kilometres</b> of <b>TE1 0ST</b>.')
        expect(response.payload).toContain('Acme Waste Ltd, 1, Industrial Estate, Testtown, TE1 0ST')
        expect(response.payload).toContain('- <b>0.10 kilometres</b>')
        expect(response.payload).toContain('- <b>1.20 kilometres</b>')
        expect(response.payload).toContain('value="WEX123456"')
        expect(response.payload).toContain(`href="${changeAddress}"`)
        expect(response.payload).toContain(`href="${manualSite}"`)
      })

      it('Happy: pre-selects a previously chosen site', async () => {
        const response = await submitGetRequest({ url }, 'Choose the site you want to report', constants.statusCodes.OK, {
          ...baseSession,
          [constants.redisKeys.RARS_CONFIRM_SITE]: { selectedSite: sites[1] }
        })
        expect(response.payload).toMatch(/value="WEX123456"\s+checked/)
      })

      it('uses the manually entered postcode instead of an earlier searched postcode', async () => {
        const addressQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
        const response = await submitGetRequest({ url }, 'Choose the site you want to report', constants.statusCodes.OK, {
          [constants.redisKeys.RARS_CONFIRM_ADDRESS]: {
            selectedAddress: [{ postcode: 'NE23 1RS', address: 'Earlier Search, NE23 1RS' }]
          },
          [constants.redisKeys.RARS_LOCATION_ADDRESS]: [{
            answerId: addressQuestion.answers.postcode.answerId,
            otherDetails: 'NE23 3AS'
          }],
          [constants.redisKeys.RARS_NEARBY_SITES]: sites
        })

        expect(response.payload).toContain('<b>2</b> addresses found within <b>3 kilometres</b> of <b>NE23 3AS</b>.')
        expect(response.payload).toContain(`href="${manualSite}"`)
      })

      it('shows empty results and navigation when there are no nearby sites', async () => {
        const response = await submitGetRequest({ url }, 'Choose the site you want to report', constants.statusCodes.OK, {
          ...baseSession,
          [constants.redisKeys.RARS_NEARBY_SITES]: []
        })
        expect(response.payload).toContain('<b>0</b> addresses found within <b>3 kilometres</b> of <b>TE1 0ST</b>.')
        expect(response.payload).toContain(`href="${changeAddress}"`)
        expect(response.payload).toContain(`href="${manualSite}"`)
        expect(response.payload).not.toContain('type="radio"')
        expect(response.payload).not.toContain('>Continue</button>')
      })
    })

    describe('POST', () => {
      it('Happy: stores selected site and redirects to confirm site', async () => {
        const options = { url, payload: { answerId: 'EPR/AB1234CD' } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, baseSession)
        expect(response.headers.location).toEqual(confirmSite)
        expect(response.request.yar.get(constants.redisKeys.RARS_CONFIRM_SITE)).toEqual({ selectedSite: sites[0] })
      })

      it('Sad: shows an error when no site is selected', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK, baseSession)
        expect(response.payload).toContain('Select a site')
        expect(response.payload).toContain('href="#answerId-1"')
      })
    })
  })
})
