import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_RECURRING
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_RECURRING
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_RECURRING
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_RECURRING
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_RECURRING
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_RECURRING
  }
]

describe('RARS Recurring Routes', () => {
  describe.each(problems)('$problem recurring', ({ problem, url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'RECURRING')
      })
    })

    describe('POST validation', () => {
      it('Should show the correct dynamic error message', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'rats' }
          : {}

        const response = await submitPostRequest(
          { url, payload: {} },
          constants.statusCodes.OK,
          sessionData
        )

        const expectedProblem = problem === 'vermin' ? 'rats' : problem
        expect(response.payload).toContain(`Select 'yes' if the ${expectedProblem} has caused you a problem before`)
      })
    })
  })
})
