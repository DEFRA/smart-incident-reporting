import { validatePayload, validateEmail } from '../helpers.js'
import { payload } from '../../__mock-data__/session-water-pollution.js'

describe('helpers', () => {
  describe('validatePayload', () => {
    it('Should successfully validate a valid payload', () => {
      const result = validatePayload(payload)
      expect(result).toBe(true)
    })
    it('Should invalidate an invalid payload', () => {
      const result = validatePayload({})
      expect(result).toBe(false)
    })
  })
  describe('validateEmail', () => {
    it('Should successfully validate a valid email address', () => {
      expect(validateEmail('test@test.com'))
      expect(validateEmail('test.test.test@email.email.email.com'))
    })
    it('Should fail validation for an invalid email address', () => {
      expect(validateEmail()).toBe(false)
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('test@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.comtest@test.com')).toBe(false)
      expect(validateEmail('test@test@test.com')).toBe(false)
      expect(validateEmail('test')).toBe(false)
      expect(validateEmail('testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest@test.com')).toBe(false)
      expect(validateEmail('test@testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest.com')).toBe(false)
      expect(validateEmail('test@testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest.test.com'))
    })
  })
})
