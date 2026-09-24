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

    it('Should not store data when optional field is empty', async () => {
      const options = {
        url,
        payload: {
          otherLocationInfo: ''
        }
      }
      const response = await submitPostRequest(options)
      const storedData = response.request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION)
      expect(storedData).toBeFalsy()
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_WHEN)
    })

    it('Should show an error and not progress when the location info exceeds the character limit', async () => {
      const otherLocationInfo = 'a'.repeat(constants.locationDescriptionCharacterLimit + 1)
      const options = {
        url,
        payload: {
          otherLocationInfo
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(`Other location information must be ${constants.locationDescriptionCharacterLimit} characters or less`)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION)).toBeFalsy()
    })

    it('Should accept location info at the character limit', async () => {
      const otherLocationInfo = 'a'.repeat(constants.locationDescriptionCharacterLimit)
      const options = {
        url,
        payload: {
          otherLocationInfo
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_WHEN)
    })
  })
})
