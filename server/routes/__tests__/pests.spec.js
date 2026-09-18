import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.PESTS

describe(url, () => {
  describe('GET', () => {
    it(`Should redirect to pests start page for ${url}`, async () => {
      await submitGetRequest({ url }, null, constants.statusCodes.REDIRECT)
    })
  })
})
