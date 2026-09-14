import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_REPORT_SENT
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_REPORT_SENT
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_REPORT_SENT
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_REPORT_SENT
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_REPORT_SENT
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_REPORT_SENT
  }
]

describe('RARS report sent routes', () => {
  describe.each(problems)('$problem report-sent', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'REPORT SENT')
      })
    })
  })
})
