import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_EFFECT_ON_HEALTH },
  { problem: 'noise', url: constants.routes.NOISE_EFFECT_ON_HEALTH },
  { problem: 'dust', url: constants.routes.DUST_EFFECT_ON_HEALTH },
  { problem: 'litter', url: constants.routes.LITTER_EFFECT_ON_HEALTH },
  { problem: 'mud', url: constants.routes.MUD_EFFECT_ON_HEALTH },
  {
    problem: 'vermin/pests',
    url: constants.routes.VERMIN_EFFECT_ON_HEALTH,
    sessionData: {
      [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin/pests'
    }
  }
]

describe('RARS Effect On Health Routes', () => {
  describe.each(problems)('$problem effect on health', ({ problem, url, sessionData = {} }) => {
    it('Should return success response and correct view', async () => {
      await submitGetRequest(
        { url },
        `Has the ${problem} caused any of the following issues?`,
        constants.statusCodes.OK,
        sessionData
      )
    })
  })
})
