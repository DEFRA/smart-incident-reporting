import { postcodeValidator } from 'postcode-validator'

import {
  email,
  empty,
  maxLength,
  postcode,
  buildErrorSummary
} from '../validation'

jest.mock('postcode-validator', () => ({
  postcodeValidator: jest.fn()
}))

describe('validation', () => {
  describe('email', () => {
    it('it should return a valid email', () => {
      const validEmail = 'test@example.com'
      expect(email(validEmail)).toBeTruthy()
    })

    it('it should return an invalid email', () => {
      const invalidEmail = 'invalidemail@'
      expect(email(invalidEmail)).toBeFalsy()
    })
  })

  describe('empty', () => {
    it('it should return empty value', () => {
      const emptyValue = ''

      expect(empty(emptyValue)).toBeTruthy()
    })

    it('it should return non-empty value', () => {
      const nonEmptyValue = 'Some text'

      expect(empty(nonEmptyValue)).toBeFalsy()
    })
  })
  describe('maxLength', () => {
    it('it should exceeds character limit', () => {
      const valueExceedsLimit = 'This value exceeds the character limit'
      const characterLimit = 10

      expect(maxLength(valueExceedsLimit, characterLimit)).toBeTruthy()
    })

    it('it should return within character limit', () => {
      const valueWithinLimit = 'Within limit'
      const characterLimit = 20

      expect(maxLength(valueWithinLimit, characterLimit)).toBeFalsy()
    })
  })

  describe('postcode', () => {
    it('it should return an valid postcode', () => {
      const validPostcode = 'SW1A 1AA'
      postcodeValidator.mockReturnValueOnce(true)

      expect(postcode(validPostcode)).toBeTruthy()
      expect(postcodeValidator).toHaveBeenCalledWith('SW1A 1AA', 'GB')
    })

    it('it should return an invalid postcode', () => {
      const invalidPostcode = 'Invalid postcode'
      postcodeValidator.mockReturnValueOnce(false)

      expect(postcode(invalidPostcode)).toBeFalsy()
      expect(postcodeValidator).toHaveBeenCalledWith('Invalid postcode', 'GB')
    })
  })

  describe('buildErrorSummary', () => {
    it('it should return errors present', () => {
      const errors = [
        { name: 'field1', text: 'Error 1' },
        { name: 'field2', text: 'Error 2' }
      ]
      const result = buildErrorSummary(errors)

      expect(result).toEqual({
        errorSummary: {
          titleText: 'There is a problem',
          errorList: [
            { text: 'Error 1', href: '#field1' },
            { text: 'Error 2', href: '#field2' }
          ]
        },
        fieldErrors: {
          field1: { text: 'Error 1' },
          field2: { text: 'Error 2' }
        }
      })
    })

    it('it should return no errors', () => {
      const errors = []
      const result = buildErrorSummary(errors)

      expect(result).toEqual({})
    })
  })
})
