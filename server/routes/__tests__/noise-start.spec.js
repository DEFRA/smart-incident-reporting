import { submitGetRequest } from '../../__test-helpers__/server.js'
import { parse } from 'node-html-parser'
import constants from '../../utils/constants.js'

const url = constants.routes.NOISE_START
const header = 'Report noise from a waste facility, industrial site or farm in England'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      const html = parse(response.payload)
      expect(html.querySelector('a.govuk-button--start').getAttribute('href')).toBe(constants.routes.NOISE)
    })
  })
})
