import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL
const header = 'Other location information (optional)'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      expect(response.payload).toContain('Other location information (optional)')
      expect(response.payload).toContain('name="otherLocationInfo"')
    })
    it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
      const sessionData = {
        'blockage/location-description': [{
          questionId: 900,
          questionAsked: 'Location description',
          questionResponse: true,
          answerId: 901,
          otherDetails: 'Details of other location information'
        }]
      }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Details of other location information</textarea')
    })
  })

  describe('POST', () => {
    it('Should accept and store other information', async () => {
      const otherLocationInfo = 'This is other location information of blocked river'
      const options = {
        url,
        payload: {
          otherLocationInfo
        }
      }
      const response = await submitPostRequest(options)
      const storedData = response.request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION)
      expect(storedData).toEqual([{
        questionId: 900,
        questionAsked: 'Location description',
        questionResponse: true,
        answerId: 901,
        otherDetails: otherLocationInfo
      }])
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_WHEN)
    })
  })
})
