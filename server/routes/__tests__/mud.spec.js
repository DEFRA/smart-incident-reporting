import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.MUD

describe(url, () => {
  describe('GET', () => {
    it(`Should redirect to mud start page for ${url}`, async () => {
      await submitGetRequest({ url }, null, constants.statusCodes.REDIRECT)
    })
  })
})
