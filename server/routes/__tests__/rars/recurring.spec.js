import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_RECURRING,
    header: 'Has this happened before?'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_RECURRING,
    header: 'Has this happened before?'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_RECURRING,
    header: 'Has this happened before?'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_RECURRING,
    header: 'Has this happened before?'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_RECURRING,
    header: 'Has this happened before?'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_RECURRING,
    header: 'Has this happened before?'
  }
]

describe('RARS Recurring Routes', () => {
  describe.each(problems)('$problem recurring', ({ problem, url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
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

        expect(response.payload).toContain('There is a problem')
        const expectedProblem = problem === 'vermin' ? 'rats' : problem
        expect(response.payload).toContain(`Select &#39;yes&#39; if the ${expectedProblem} has caused you a problem before`)
      })
    })
  })
})
