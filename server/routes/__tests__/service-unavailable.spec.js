import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.SERVICE_UNAVAILABLE

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Sorry, the service is unavailable')
    })
  })
})
