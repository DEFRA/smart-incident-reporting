import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_FIND_ADDRESS
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_FIND_ADDRESS
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_FIND_ADDRESS
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_FIND_ADDRESS
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_FIND_ADDRESS
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_FIND_ADDRESS
  }
]

describe('RARS Find Address Routes', () => {
  describe.each(problems)('$problem find address', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'FIND ADDRESS')
      })
    })
  })
})
