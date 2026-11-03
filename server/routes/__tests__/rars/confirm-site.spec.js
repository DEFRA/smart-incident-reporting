import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const session = {
  [constants.redisKeys.RARS_CONFIRM_SITE]: {
    selectedSite: { id: 'EPR/AB1234CD', name: 'Acme Waste Ltd', address: '1, Industrial Estate, Testtown, TE1 0ST' }
  }
}

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_CONFIRM_SITE, chooseSite: constants.routes.SMELL_CHOOSE_SITE, next: constants.routes.SMELL_DESCRIPTION },
  { problem: 'noise', url: constants.routes.NOISE_CONFIRM_SITE, chooseSite: constants.routes.NOISE_CHOOSE_SITE, next: constants.routes.NOISE_DESCRIPTION },
  { problem: 'dust', url: constants.routes.DUST_CONFIRM_SITE, chooseSite: constants.routes.DUST_CHOOSE_SITE, next: constants.routes.DUST_DESCRIPTION },
  { problem: 'litter', url: constants.routes.LITTER_CONFIRM_SITE, chooseSite: constants.routes.LITTER_CHOOSE_SITE, next: constants.routes.LITTER_DESCRIPTION },
  { problem: 'mud', url: constants.routes.MUD_CONFIRM_SITE, chooseSite: constants.routes.MUD_CHOOSE_SITE, next: constants.routes.MUD_DESCRIPTION },
  { problem: 'vermin/pests', url: constants.routes.PESTS_CONFIRM_SITE, chooseSite: constants.routes.PESTS_CHOOSE_SITE, next: constants.routes.PESTS_RECURRING }
]

describe('RARS Confirm Site Routes', () => {
  describe.each(problems)('$problem confirm site', ({ url, chooseSite, next }) => {
    describe('GET', () => {
      it('Happy: displays the selected site in the inset text', async () => {
        const response = await submitGetRequest({ url }, 'Confirm site', constants.statusCodes.OK, session)
        expect(response.payload).toContain('Acme Waste Ltd<br>1, Industrial Estate, Testtown, TE1 0ST')
        expect(response.payload).toContain(`href="${chooseSite}"`)
      })

      it('Sad: redirects to choose site when no site has been selected', async () => {
        const response = await submitGetRequest({ url }, null, constants.statusCodes.REDIRECT)
        expect(response.headers.location).toEqual(chooseSite)
      })
    })

    describe('POST', () => {
      it('Happy: redirects to the next page', async () => {
        const response = await submitPostRequest({ url }, constants.statusCodes.REDIRECT, session)
        expect(response.headers.location).toEqual(next)
      })
    })
  })
})
