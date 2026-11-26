import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_SOURCE

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response for ${url}`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })
})
