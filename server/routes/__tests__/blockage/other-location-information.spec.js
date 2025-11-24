import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_OTHER_LOCATION_INFORMATION
const header = 'Other location information(optional)'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
      const sessionData = {
        'blockage/other-location-information': 'Details of other location information'
      }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Details of other location information</textarea')
    })
  })

  describe('POST', () => {
    it('Should accept and store a other information', async () => {
      const otherLocationInfo = 'This is other location information of blocked river'
      const options = {
        url,
        payload: {
          otherLocationInfo
        }
      }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_OTHER_LOCATION_INFORMATION)).toEqual(otherLocationInfo)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
    })
  })
})
