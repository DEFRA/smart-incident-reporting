import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_FIND_ADDRESS

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Find your address')
    })
    it(`Happy: Should return success response and correct view when counter value is 5 for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Find your address', constants.statusCodes.OK, {
        counter: 5
      })
      expect(response.payload).toContain('Find your address')
      expect(response.payload).toContain('Building number or name')
      expect(response.payload).toContain('For example, 15 or Prospect Cottage')
    })
    it(`Happy: Should return success response with navigation links ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Find your address', constants.statusCodes.OK)
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answers and redirects to SMELL_CHOOSE_ADDRESS', async () => {
      const sessionData = {
        url,
        payload: {
          buildingDetails: 'Building Name',
          postcode: 'WA4 1HT'
        }
      }
      const response = await submitPostRequest(sessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CHOOSE_ADDRESS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_FIND_ADDRESS)).toEqual({ buildingDetails: 'Building Name', postcode: 'WA4 1HT' })
    })
    it('Sad: errors on no fields provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a building number or name')
      expect(response.payload).toContain('Enter an postcode')
    })
    it('Sad: error on invalid postcode', async () => {
      const options = {
        url,
        payload: {
          buildingDetails: 'Building Name',
          postcode: 'WA4 1H'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a full postcode, for example W1 8QS')
    })
    it('Sad: accepts valid answers but the counter value exceeds 10, hence redirects to SMELL_EXCEEDED_ATTEMPTS', async () => {
      const options = {
        url,
        payload: {
          buildingDetails: 'Building Name',
          postcode: 'WA4 1HT'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        counter: 20
      })
      expect(response.headers.location).toEqual(constants.routes.SMELL_EXCEEDED_ATTEMPTS)
    })
  })
})
