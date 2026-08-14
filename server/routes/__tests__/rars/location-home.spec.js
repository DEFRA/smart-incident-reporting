import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_HOME,
    header: 'LOCATION HOME'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_HOME,
    header: 'LOCATION HOME'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_HOME,
    header: 'LOCATION HOME'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_HOME,
    header: 'LOCATION HOME'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_HOME,
    header: 'LOCATION HOME'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_HOME,
    header: 'LOCATION HOME'
  }
]

describe('RARS Location Home Routes', () => {
  describe.each(problems)('$problem location home', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })
})
