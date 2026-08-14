import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_DESCRIPTION
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_DESCRIPTION
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_DESCRIPTION
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_DESCRIPTION
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_DESCRIPTION
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_DESCRIPTION
  }
]

describe('RARS Location Description Routes', () => {
  describe.each(problems)('$problem location description', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'LOCATION DESCRIPTION')
      })
    })
  })
})
