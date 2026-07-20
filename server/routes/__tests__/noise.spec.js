import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.NOISE

describe(url, () => {
  describe('GET', () => {
    it(`Should redirect to noise start page for ${url}`, async () => {
      await submitGetRequest({ url }, null, constants.statusCodes.REDIRECT)
    })
  })
})
