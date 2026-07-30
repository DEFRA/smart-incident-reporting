import { validatePayload, validateEmail, getServiceDetails } from '../helpers.js'
import { payload } from '../../__mock-data__/session-water-pollution.js'
import constants from '../constants.js'

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
  describe('getServiceDetails', () => {
    it.each([
      ['smell', constants.serviceNames.SMELL, constants.urls.GOV_UK_SMELL],
      ['noise', constants.serviceNames.NOISE, constants.urls.GOV_UK_NOISE],
      ['dust', constants.serviceNames.DUST, constants.urls.GOV_UK_DUST],
      ['litter', constants.serviceNames.LITTER, constants.urls.GOV_UK_LITTER],
      ['mud', constants.serviceNames.MUD, constants.urls.GOV_UK_MUD],
      ['vermin', constants.serviceNames.VERMIN, constants.urls.GOV_UK_VERMIN]
    ])('Should return correct details for %s', (problem, expectedServiceName, expectedUrl) => {
      const result = getServiceDetails(problem)
      expect(result.serviceName).toBe(expectedServiceName)
      expect(result.serviceUrl).toBe(expectedUrl)
      expect(result.pageTitleServiceName).toBe(expectedServiceName)
    })
    it('Should return undefined serviceName and serviceUrl for unknown problem', () => {
      const result = getServiceDetails('unknown')
      expect(result.serviceName).toBeUndefined()
      expect(result.serviceUrl).toBeUndefined()
    })
  })
})
