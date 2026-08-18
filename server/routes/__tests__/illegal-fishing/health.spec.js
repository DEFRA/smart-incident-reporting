import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_HEALTH

describe(url, () => {
  describe('GET', () => {
    it(`Should return a success response for ${url}`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.result).toEqual({ status: 'ok' })
    })
  })
})
