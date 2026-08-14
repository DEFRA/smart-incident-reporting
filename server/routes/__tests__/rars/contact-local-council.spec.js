import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_CONTACT_LOCAL_COUNCIL,
    header: 'CONTACT LOCAL COUNCIL'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_CONTACT_LOCAL_COUNCIL,
    header: 'CONTACT LOCAL COUNCIL'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_CONTACT_LOCAL_COUNCIL,
    header: 'CONTACT LOCAL COUNCIL'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_CONTACT_LOCAL_COUNCIL,
    header: 'CONTACT LOCAL COUNCIL'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_CONTACT_LOCAL_COUNCIL,
    header: 'CONTACT LOCAL COUNCIL'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_CONTACT_LOCAL_COUNCIL,
    header: 'CONTACT LOCAL COUNCIL'
  }
]

describe('RARS Contact Local Council Routes', () => {
  describe.each(problems)('$problem contact local council', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })
})
