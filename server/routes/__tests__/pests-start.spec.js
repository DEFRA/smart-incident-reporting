import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.PESTS_START
const header = 'Report vermin or pest problem from a waste facility, industrial site or farm in England'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      const html = parse(response.payload)

      expect(html.querySelector('.js-cookie-banner-container')).not.toBeNull()
      expect(html.querySelector('.js-question-banner').hasAttribute('hidden')).toBe(false)
    })
  })
})
