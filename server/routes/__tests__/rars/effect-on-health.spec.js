import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_EFFECT_ON_HEALTH },
  { problem: 'noise', url: constants.routes.NOISE_EFFECT_ON_HEALTH },
  { problem: 'dust', url: constants.routes.DUST_EFFECT_ON_HEALTH },
  { problem: 'litter', url: constants.routes.LITTER_EFFECT_ON_HEALTH },
  { problem: 'mud', url: constants.routes.MUD_EFFECT_ON_HEALTH },
  { problem: 'vermin', url: constants.routes.VERMIN_EFFECT_ON_HEALTH }
]

describe('RARS Effect On Health Routes', () => {
  describe.each(problems)('$problem effect on health', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'EFFECT ON HEALTH', constants.statusCodes.OK)
      })
    })
  })
})
