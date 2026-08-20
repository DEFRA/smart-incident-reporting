import { submitGetRequest } from '../../../__test-helpers__/server.js'
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
  describe.each(problems)('$problem recurring', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'RECURRING')
      })
    })
  })
})
