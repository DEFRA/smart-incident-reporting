import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const sites = [
  { id: 'EPR/AB1234CD', name: 'Acme Waste Ltd', address: '1, Industrial Estate, Testtown, TE1 0ST' },
  { id: 'WEX123456', name: 'Testco Recycling', address: '' }
]

const baseSession = {
  [constants.redisKeys.RARS_CONFIRM_ADDRESS]: {
    selectedAddress: [{ postcode: 'TE1 0ST', address: 'Test House, Testtown, TE1 0ST', x: 365739, y: 343015 }]
  },
  [constants.redisKeys.RARS_NEARBY_SITES]: sites
}

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_CHOOSE_SITE, confirmSite: constants.routes.SMELL_CONFIRM_SITE, next: constants.routes.SMELL_DESCRIPTION },
  { problem: 'noise', url: constants.routes.NOISE_CHOOSE_SITE, confirmSite: constants.routes.NOISE_CONFIRM_SITE, next: constants.routes.NOISE_DESCRIPTION },
  { problem: 'dust', url: constants.routes.DUST_CHOOSE_SITE, confirmSite: constants.routes.DUST_CONFIRM_SITE, next: constants.routes.DUST_DESCRIPTION },
  { problem: 'litter', url: constants.routes.LITTER_CHOOSE_SITE, confirmSite: constants.routes.LITTER_CONFIRM_SITE, next: constants.routes.LITTER_DESCRIPTION },
  { problem: 'mud', url: constants.routes.MUD_CHOOSE_SITE, confirmSite: constants.routes.MUD_CONFIRM_SITE, next: constants.routes.MUD_DESCRIPTION },
  { problem: 'vermin/pests', url: constants.routes.PESTS_CHOOSE_SITE, confirmSite: constants.routes.PESTS_CONFIRM_SITE, next: constants.routes.PESTS_RECURRING }
]

describe('RARS Choose Site Routes', () => {
  describe.each(problems)('$problem choose site', ({ url, confirmSite, next }) => {
    describe('GET', () => {
      it('Happy: lists nearby sites', async () => {
        const response = await submitGetRequest({ url }, 'Choose the site you want to report', constants.statusCodes.OK, baseSession)
        expect(response.payload).toContain('2 sites found within 3km of <b>TE1 0ST</b>.')
        expect(response.payload).toContain('Acme Waste Ltd, 1, Industrial Estate, Testtown, TE1 0ST')
        expect(response.payload).toContain('value="WEX123456"')
        expect(response.payload).toContain(`href="${next}"`)
      })

      it('Happy: pre-selects a previously chosen site', async () => {
        const response = await submitGetRequest({ url }, 'Choose the site you want to report', constants.statusCodes.OK, {
          ...baseSession,
          [constants.redisKeys.RARS_CONFIRM_SITE]: { selectedSite: sites[1] }
        })
        expect(response.payload).toMatch(/value="WEX123456"\s+checked/)
      })

      it('Sad: redirects to next page when there are no nearby sites', async () => {
        const response = await submitGetRequest({ url }, null, constants.statusCodes.REDIRECT, {
          ...baseSession,
          [constants.redisKeys.RARS_NEARBY_SITES]: []
        })
        expect(response.headers.location).toEqual(next)
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
