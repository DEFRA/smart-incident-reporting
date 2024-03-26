import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
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
    it('Should redirect to /water-pollution if details correct', async () => {
      const options = {
        url,
        payload: {
          fullName: 'John Smith',
          phone: '#+441234567890',
          accessCode: 'password'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual('/water-pollution')
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
    // it.only('Should return service unavailable if outside working hours', done => {
    //   jest.isolateModules(async () => {
    //     try {
    //       const isWorkingHours = require('../../utils/is-working-hours').default
    //       jest.mock('../../utils/is-working-hours')
    //       isWorkingHours.mockImplementation = (() => {
    //         console.log('in mock')
    //         return Promise.resolve(false)
    //       })
    //       // isWorkingHours.mockResolvedValue(false)
    //       const response = await submitGetRequest({ url })
    //       done()
    //     } catch (e) {
    //       done(e)
    //     }
    //   })
    // })
  })
})
