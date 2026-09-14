import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_CONTACT_DETAILS,
    header: 'Contact details'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_CONTACT_DETAILS,
    header: 'Contact details'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_CONTACT_DETAILS,
    header: 'Contact details'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_CONTACT_DETAILS,
    header: 'Contact details'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_CONTACT_DETAILS,
    header: 'Contact details'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_CONTACT_DETAILS,
    header: 'Contact details'
  }
]

describe('RARS Contact Details Routes', () => {
  describe.each(problems)('$problem contact details', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })
})
