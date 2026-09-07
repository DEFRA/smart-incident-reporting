import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_SMELL_STRENGTH

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and the dummy page title for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'SMELL STRENGTH')
      expect(response.payload).toContain('SMELL STRENGTH')
    })
  })
})
