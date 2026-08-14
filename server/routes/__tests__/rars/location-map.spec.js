import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_MAP
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_MAP
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_MAP
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_MAP
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_MAP
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_MAP
  }
]

describe('RARS Location Map Routes', () => {
  describe.each(problems)('$problem location map', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'LOCATION MAP')
      })
    })
  })
})
