import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_DESCRIPTION,
    header: 'DESCRIPTION'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_DESCRIPTION,
    header: 'DESCRIPTION'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_DESCRIPTION,
    header: 'DESCRIPTION'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_DESCRIPTION,
    header: 'DESCRIPTION'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_DESCRIPTION,
    header: 'DESCRIPTION'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_DESCRIPTION,
    header: 'DESCRIPTION'
  }
]

describe('RARS Description Routes', () => {
  describe.each(problems)('$problem description', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })
})
