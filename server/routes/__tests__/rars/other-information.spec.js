import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_OTHER_INFORMATION
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_OTHER_INFORMATION
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_OTHER_INFORMATION
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_OTHER_INFORMATION
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_OTHER_INFORMATION
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_OTHER_INFORMATION
  }
]

describe('RARS other information routes', () => {
  describe.each(problems)('$problem other-information', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'Is there anything else you\'d like to add')
      })
    })
  })
})
