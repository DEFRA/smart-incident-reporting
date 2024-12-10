import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.WATER_POLUTION
const header = 'Report water pollution'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Happy: Reset the CYA journey if user restarts the WP journey before report submission ${url}`, async () => {
      const sessionData = {
        referer: '/water-pollution/check-your-answers'
      }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.request.yar.get(constants.redisKeys.REFERER)).toEqual(null)
    })
  })
})
