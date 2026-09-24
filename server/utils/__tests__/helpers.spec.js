import { validatePayload, validateEmail, getServiceDetails, titleHelper } from '../helpers.js'
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
    beforeEach(() => {
      process.env.REGISTER_START_ROUTES = 'false'
    })

    afterEach(() => {
      process.env.REGISTER_START_ROUTES = 'true'
    })

    it.each([
      ['smell', constants.serviceNames.SMELL, constants.urls.GOV_UK_SMELL],
      ['noise', constants.serviceNames.NOISE, constants.urls.GOV_UK_NOISE],
      ['dust', constants.serviceNames.DUST, constants.urls.GOV_UK_DUST],
      ['litter', constants.serviceNames.LITTER, constants.urls.GOV_UK_LITTER],
      ['mud', constants.serviceNames.MUD, constants.urls.GOV_UK_MUD],
      ['vermin/pests', constants.serviceNames.PESTS, constants.urls.GOV_UK_PESTS]
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
    it('Should return relative serviceUrl when REGISTER_START_ROUTES is true', () => {
      process.env.REGISTER_START_ROUTES = 'true'
      const result = getServiceDetails('smell')
      expect(result.serviceUrl).toBe('/')
      process.env.REGISTER_START_ROUTES = 'false'
    })
  })
  describe('titleHelper', () => {
    const questionText = 'Where is the {problem} coming from?'
    const verminPestsQuestion = 'Where are the the {vermin/pests} coming from?'
    const mockRequest = (verminPestsType) => ({ yar: { get: () => verminPestsType } })

    it('Should replace {problem} with the problem for non-vermin problems', () => {
      const { title, pageTitle } = titleHelper(mockRequest(null), questionText, verminPestsQuestion, 'smell')
      expect(title).toBe('Where is the smell coming from?')
      expect(pageTitle).toBe('Where is the smell coming from')
    })

    it('Should use the vermin/pests type from session for title when problem is vermin/pests', () => {
      const { title, pageTitle } = titleHelper(mockRequest('rats'), questionText, verminPestsQuestion, 'vermin/pests')
      expect(title).toBe('Where are the the rats coming from?')
      expect(pageTitle).toBe('Where are the the rats coming from')
    })
  })
})
