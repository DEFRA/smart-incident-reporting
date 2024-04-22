import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
const url = '/'


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
          accessCode: 'ODINTERNAL'
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
      expect(response.payload).toContain('Enter a phone number')
      expect(response.payload).toContain('Enter an access code')
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
      expect(response.payload).toContain('Enter a phone number')
      expect(response.payload).toContain('Enter an access code')
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
      expect(response.payload).not.toContain('Enter a phone number')
      expect(response.payload).toContain('Enter an access code')
    })
    // Sad: all present, code not matching account
    it('Should error with 401:Unauthorised if invalid access code', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          accessCode: 'sdfsdfsd'
        }
      }
      const response = await submitPostRequest(options, 401)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).not.toContain('Enter your name')
      expect(response.payload).not.toContain('Enter a phone number')
      expect(response.payload).not.toContain('Enter an access code')
      expect(response.payload).toContain('Check you have entered your access code correctly')
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
      expect(response.payload).not.toContain('Enter a phone number')
      expect(response.payload).toContain('Enter a real phone number')
      expect(response.payload).not.toContain('Enter an access code')
    })
  })
})
