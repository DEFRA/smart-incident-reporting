import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.SMELL_CONTACT_DETAILS
const phoneError = 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
const emailError = 'Enter an email address in the correct format, like name@example.com'

const sessionData = {
  'smell/contact-details': {
    reporterName: 'test name',
    reporterPhoneNumber: '012345678910',
    reporterEmailAddress: 'test@test.com'
  }
}

describe(url, () => {
  describe('GET', () => {
    it('Should display contact-details view', async () => {
      const response = await submitGetRequest({ url }, 'Your contact details', constants.statusCodes.OK, sessionData)
      expect(response.result).toContain('value="test name"')
      expect(response.result).toContain('value="012345678910"')
      expect(response.result).toContain('value="test@test.com"')
    })
  })
  describe('POST', () => {
    it('Happy: Accepts valid answers and redirects to SMELL_IMAGES_OR_VIDEO', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_IMAGES_OR_VIDEO)
      expect(response.request.yar.get(constants.redisKeys.SMELL_CONTACT_DETAILS)).toEqual({
        reporterName: 'John Smith',
        reporterPhoneNumber: '#+441234567890',
        reporterEmailAddress: 'test@test.com'
      })
    })
    it('Sad: Should error with if invalid phone number', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: 'sdfsrt'
        }
      }
      const response = await submitPostRequest(options, 200, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain(phoneError)
    })
    it('Sad: Should error with if invalid email address', async () => {
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
