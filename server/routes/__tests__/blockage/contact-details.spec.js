import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_CONTACT_DETAILS
const phoneError = 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
const emailError = 'Enter an email address in the correct format, like name@example.com'

const sessionData = {
  'blockage/contact-details': {
    detailsName: 'test name',
    detailsPhone: '012345678910',
    detailsEmail: 'test@test.com'
  }
}

describe(url, () => {
  describe('GET', () => {
    it('Should display contact-details view with saved values', async () => {
      const response = await submitGetRequest({ url }, 'Your contact details', constants.statusCodes.OK, sessionData)
      expect(response.result).toContain('value="test name"')
    })

    it('Should display empty form when no session data', async () => {
      const response = await submitGetRequest({ url }, 'Your contact details', constants.statusCodes.OK)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })

  describe('POST', () => {
    it.each([
      {
        description: 'all fields',
        payload: { fullName: 'John Smith', phone: '#+441234567890', email: 'test@test.com' },
        expected: { detailsName: 'John Smith', detailsPhone: '#+441234567890', detailsEmail: 'test@test.com' }
      },
      {
        description: 'no payload',
        payload: undefined,
        expected: { detailsName: '', detailsPhone: '', detailsEmail: '' }
      },
      {
        description: 'empty fields',
        payload: { fullName: '', phone: '', email: '' },
        expected: { detailsName: '', detailsPhone: '', detailsEmail: '' }
      },
      {
        description: 'name only',
        payload: { fullName: 'John Smith', phone: '', email: '' },
        expected: { detailsName: 'John Smith', detailsPhone: '', detailsEmail: '' }
      },
      {
        description: 'email only',
        payload: { fullName: '', phone: '', email: 'test@test.com' },
        expected: { detailsName: '', detailsPhone: '', detailsEmail: 'test@test.com' }
      }
    ])('Accepts $description and redirects to BLOCKAGE_START', async ({ payload, expected }) => {
      const options = { url, payload }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
    })

    it.each([
      {
        description: 'all fields',
        payload: { fullName: 'John Smith', phone: '#+441234567890', email: 'test@test.com' },
        expected: { detailsName: 'John Smith', detailsPhone: '#+441234567890', detailsEmail: 'test@test.com' }
      },
      {
        description: 'empty fields',
        payload: { fullName: '', phone: '', email: '' },
        expected: { detailsName: '', detailsPhone: '', detailsEmail: '' }
      },
      {
        description: 'name only',
        payload: { fullName: 'John Smith', phone: '', email: '' },
        expected: { detailsName: 'John Smith', detailsPhone: '', detailsEmail: '' }
      },
      {
        description: 'email only',
        payload: { fullName: '', phone: '', email: 'test@test.com' },
        expected: { detailsName: '', detailsPhone: '', detailsEmail: 'test@test.com' }
      }
    ])('Saves $description to session', async ({ payload, expected }) => {
      const options = { url, payload }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS)).toEqual(expected)
    })

    it('Should error with invalid phone number', async () => {
      const options = {
        url,
        payload: { fullName: 'John Smith', phone: 'invalid-phone', email: '' }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain(phoneError)
    })

    it('Should error with invalid email address', async () => {
      const options = {
        url,
        payload: { fullName: 'John Smith', phone: '', email: 'invalid-email' }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain(emailError)
    })

    it('Should preserve field values when validation fails', async () => {
      const options = {
        url,
        payload: { fullName: 'John Smith', phone: 'invalid-phone', email: 'test@test.com' }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('value="John Smith"')
    })
  })
})
