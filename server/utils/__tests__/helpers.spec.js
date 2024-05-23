import { validatePayload } from '../helpers.js'
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
})
