import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
    header: 'Report the smell to your local council'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_REPORT_LOCAL_COUNCIL,
    header: 'Report the noise to your local council'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_REPORT_LOCAL_COUNCIL,
    header: 'Report the dust to your local council'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_REPORT_LOCAL_COUNCIL,
    header: 'Report the litter to your local council'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_REPORT_LOCAL_COUNCIL,
    header: 'Report the mud to your local council'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_REPORT_LOCAL_COUNCIL,
    header: 'Report the vermin to your local council'
  }
]

describe('RARS Report Local Council Routes', () => {
  describe.each(problems)('$problem report local council', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })
})
