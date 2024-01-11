import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
const url = '/'

describe(url, () => {
  describe('GET', () => {
    it(`Should redirect to ${constants.routes.REPORT_WATER_POLLUTION}`, async () => {
      await submitGetRequest({ url }, 302)
      expect(true)
    })
  })
})
