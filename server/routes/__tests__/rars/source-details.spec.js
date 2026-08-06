import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_SOURCE_DETAILS,
    header: 'SOURCE DETAILS'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_SOURCE_DETAILS,
    header: 'SOURCE DETAILS'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_SOURCE_DETAILS,
    header: 'SOURCE DETAILS'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_SOURCE_DETAILS,
    header: 'SOURCE DETAILS'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_SOURCE_DETAILS,
    header: 'SOURCE DETAILS'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_SOURCE_DETAILS,
    header: 'SOURCE DETAILS'
  }
]

describe('RARS Source Details Routes', () => {
  describe.each(problems)('$problem source details', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })
})
