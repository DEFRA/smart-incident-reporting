import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.WATER_POLLUTION_YOUR_DETAILS
const phoneEmptyError = 'Enter a phone number'
const phoneError = 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
const emailError = 'Enter an email address in the correct format, like name@example.com'

const sessionData = {
  home: {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com',
    reporterAccessCode: 'test'
  }
}

describe(url, () => {
  describe('GET', () => {
    it('Should display update-details view', async () => {
      const response = await submitGetRequest({ url }, 'Your details', constants.statusCodes.OK, sessionData)
      expect(response.result).toContain('value="test name"')
      expect(response.result).toContain('value="012345678910"')
      expect(response.result).toContain('value="test@test.com"')
    })
  })
  describe('POST', () => {
    // Happy: All valid with correct accessCode
    it('Should redirect to WATER_POLLUTION_CHECK_YOUR_ANSWERS', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual('/water-pollution/check-your-answers')
      expect(response.request.yar.get(constants.redisKeys.HOME)).toEqual({
        reporterName: 'John Smith',
        reporterPhoneNumber: '#+441234567890',
        reporterEmailAddress: 'test@test.com',
        reporterAccessCode: 'test'
      })
    })
    // Sad: name, phone, code missing
    it('Should error if all is data missing', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter your name')
      expect(response.payload).toContain(phoneEmptyError)
      expect(response.payload).toContain(emailError)
    })
    // Sad: invalid phone format
    it('Should error with if invalid phone number', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: 'sdfsrt'
        }
      }
      const response = await submitPostRequest(options, 200, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).not.toContain('Enter your name')
      expect(response.payload).toContain(phoneError)
    })
    // Sad: invalid email format
    it('Should error with if invalid email address', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '012345678910',
          email: 'sdfdsf'
        }
      }
      const response = await submitPostRequest(options, 200, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(emailError)
    })
  })
})
