import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.REPORT_WATER_POLUTION

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.payload).toContain('<h1 class="govuk-heading-xl">Report water pollution</h1>')
    })
  })
})
