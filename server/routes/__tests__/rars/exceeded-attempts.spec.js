import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_EXCEEDED_ATTEMPTS, enterAddress: constants.routes.SMELL_LOCATION_ADDRESS },
  { problem: 'noise', url: constants.routes.NOISE_EXCEEDED_ATTEMPTS, enterAddress: constants.routes.NOISE_LOCATION_ADDRESS },
  { problem: 'dust', url: constants.routes.DUST_EXCEEDED_ATTEMPTS, enterAddress: constants.routes.DUST_LOCATION_ADDRESS },
  { problem: 'litter', url: constants.routes.LITTER_EXCEEDED_ATTEMPTS, enterAddress: constants.routes.LITTER_LOCATION_ADDRESS },
  { problem: 'mud', url: constants.routes.MUD_EXCEEDED_ATTEMPTS, enterAddress: constants.routes.MUD_LOCATION_ADDRESS },
  { problem: 'vermin', url: constants.routes.VERMIN_EXCEEDED_ATTEMPTS, enterAddress: constants.routes.VERMIN_LOCATION_ADDRESS }
]

describe('RARS Exceeded Attempts Routes', () => {
  describe.each(problems)('$problem exceeded attempts', ({ url, enterAddress }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const response = await submitGetRequest({ url }, 'You have made too many searches')
        expect(response.payload).toContain('You cannot search for more addresses right now.')
        expect(response.payload).toContain(`href="${enterAddress}"`)
        expect(response.payload).toContain('Enter address manually')
      })
    })
  })
})
