import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_OTHER_INFORMATION
const header = 'Is there anything else you\'d like to add (optional)?'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
      const sessionData = {
        'water-pollution/other-information': 'Details of other information'
      }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Details of other information</textarea')
    })
  })

  describe('POST', () => {
    it('Should accept and store a description', async () => {
      const otherInfo = 'This is a description of the water pollution'
      const options = {
        url,
        payload: {
          otherInfo
        }
      }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION)).toEqual(otherInfo)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
    })
  })
})
