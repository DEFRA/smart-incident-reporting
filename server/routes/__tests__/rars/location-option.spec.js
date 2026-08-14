import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_OPTION
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_OPTION
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_OPTION
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_OPTION
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_OPTION
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_OPTION
  }
]

describe('RARS Location Option Routes', () => {
  describe.each(problems)('$problem location option', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'LOCATION OPTION')
      })
    })
  })
})
