import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_WHEN
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_WHEN
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_WHEN
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_WHEN
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_WHEN
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_WHEN
  }
]

describe('RARS When Routes', () => {
  describe.each(problems)('$problem when', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'WHEN')
      })
    })
  })
})
