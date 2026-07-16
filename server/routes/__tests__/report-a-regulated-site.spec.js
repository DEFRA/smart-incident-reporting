import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.REPORT_A_REGULATED_SITE

describe(url, () => {
  describe('GET', () => {
    it(`Should redirect to home page for ${url}`, async () => {
      await submitGetRequest({ url }, null, constants.statusCodes.REDIRECT)
    })
  })
})
