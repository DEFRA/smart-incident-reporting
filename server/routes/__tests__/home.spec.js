import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
const url = '/'
const phoneEmptyError = 'Enter a phone number'
const phoneError = 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
const emailError = 'Enter an email address in the correct format, like name@example.com'
const accessCodeEmptyError = 'Enter an access code'
const accessCodeInvalidError = 'Check you have entered your access code correctly, without any spaces at the end'

// As the mocked return for this default es6 module export gets cached, separate test file
// named home-unavailable.spec.js tests the outside of working hours logic
jest.mock('../../utils/is-working-hours', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(true))
}))

describe(url, () => {
  describe('GET', () => {
    it('Should display sign in view', async () => {
      await submitGetRequest({ url }, 'Sign in')
    })
  })
  describe('POST', () => {
    // Happy: All valid with correct accessCode
    it('Should redirect to /water-pollution if water pollution login', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com',
          accessCode: 'WPINTERNAL'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLUTION)
    })
    it('Should redirect to /smell if odure login', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com',
          accessCode: 'ODINTERNAL'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL)
    })
    it('Should redirect to /smell if odure login', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com',
          accessCode: 'RPSMINTERNAL'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL)
    })
    // Sad: name, phone, code missing
    it('Should error if all is data missing', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter your name')
      expect(response.payload).toContain(phoneEmptyError)
      expect(response.payload).toContain(emailError)
      expect(response.payload).toContain(accessCodeEmptyError)
    })
    // Sad: phone, code missing
    it('Should error if partial data missing', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith'
        }
      }
      const response = await submitPostRequest(options, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).not.toContain('Enter your name')
      expect(response.payload).toContain(phoneEmptyError)
      expect(response.payload).toContain(emailError)
      expect(response.payload).toContain(accessCodeEmptyError)
    })
    // sad: name, code missing
    it('Should error if partial data missing', async () => {
      const options = {
        url,
        payload: {
          phone: '012345678910'
        }
      }
      const response = await submitPostRequest(options, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter your name')
      expect(response.payload).not.toContain(phoneEmptyError)
      expect(response.payload).toContain(emailError)
      expect(response.payload).toContain(accessCodeEmptyError)
    })
    // Sad: all present, code not matching account
    it('Should error with 401:Unauthorised if invalid access code', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          email: 'test@test.com',
          accessCode: 'sdfsdfsd'
        }
      }
      const response = await submitPostRequest(options, 401)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).not.toContain('Enter your name')
      expect(response.payload).not.toContain(phoneEmptyError)
      expect(response.payload).not.toContain(emailError)
      expect(response.payload).not.toContain(accessCodeEmptyError)
      expect(response.payload).toContain(accessCodeInvalidError)
    })
    // Sad: invalid phone format
    it('Should error with if invalid phone number', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: 'sdfsrt',
          accessCode: 'sdfsdfsd'
        }
      }
      const response = await submitPostRequest(options, 200)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).not.toContain('Enter your name')
      expect(response.payload).toContain(phoneError)
      expect(response.payload).not.toContain(accessCodeEmptyError)
    })
  })
})
