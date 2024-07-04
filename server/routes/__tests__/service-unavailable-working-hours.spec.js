import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.SERVICE_UNAVAILABLE

describe(url, () => {
  describe('GET', () => {
    it('Should redirect to home page inside working hours', async () => {
      const response = await submitGetRequest({ url }, '', 302)
      expect(response.headers.location).toEqual('/')
    })
  })
})
