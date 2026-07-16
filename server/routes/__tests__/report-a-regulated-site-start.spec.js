import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.REPORT_A_REGULATED_SITE_START

describe(url, () => {
  describe('GET', () => {
    it.each([
      ['smell', 'Report smell from a waste facility, industrial site or farm in England'],
      ['noise', 'Report noise from a waste facility, industrial site or farm in England'],
      ['vermin', 'Report vermin from a waste facility, industrial site or farm in England'],
      ['dust', 'Report dust from a waste facility, industrial site or farm in England'],
      ['mud', 'Report mud from a waste facility, industrial site or farm in England'],
      ['litter', 'Report litter from a waste facility, industrial site or farm in England']
    ])('Should return success response and correct view with %s type', async (type, header) => {
      await submitGetRequest({ url: `${url}?type=${type}` }, header)
    })
  })
})
