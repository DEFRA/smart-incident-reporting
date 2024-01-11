import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.COOKIES

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.payload).toContain('<h1 class="govuk-heading-xl">How we use cookies</h1>')
    })
  })
})
