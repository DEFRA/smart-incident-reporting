import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_CONTACT_WATER_COMPANY
const pageTitle = 'Contact your water company'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response for ${url}`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })

    it(`Should display the contact information for ${url}`, async () => {
      const response = await submitGetRequest({ url }, pageTitle)

      expect(response.payload).toContain('Contact your water company')
      expect(response.payload).toContain('https://www.water.org.uk/customers/find-your-supplier')
      expect(response.payload).toContain('Call 999 if you or someone else is in immediate danger.')
    })
  })
})
