import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.RARS_EFFECT_ON_DAILY_LIFE

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and the dummy page title for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'EFFECT ON DAILY LIFE')
      expect(response.payload).toContain('EFFECT ON DAILY LIFE')
    })
  })

  describe('POST', () => {
    it('Should redirect to the location description page', async () => {
      const response = await submitPostRequest({ url, payload: {} })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(constants.routes.VERMIN_LOCATION_DESCRIPTION)
    })
  })
})
