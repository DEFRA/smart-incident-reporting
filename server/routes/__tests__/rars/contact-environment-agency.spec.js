import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_CONTACT_ENVIRONMENT_AGENCY,
    header: 'CONTACT ENVIRONMENT AGENCY'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_CONTACT_ENVIRONMENT_AGENCY,
    header: 'CONTACT ENVIRONMENT AGENCY'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_CONTACT_ENVIRONMENT_AGENCY,
    header: 'CONTACT ENVIRONMENT AGENCY'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY,
    header: 'CONTACT ENVIRONMENT AGENCY'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_CONTACT_ENVIRONMENT_AGENCY,
    header: 'CONTACT ENVIRONMENT AGENCY'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_CONTACT_ENVIRONMENT_AGENCY,
    header: 'CONTACT ENVIRONMENT AGENCY'
  }
]

describe('RARS Contact Environment Agency Routes', () => {
  describe.each(problems)('$problem contact environment agency', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })
})
