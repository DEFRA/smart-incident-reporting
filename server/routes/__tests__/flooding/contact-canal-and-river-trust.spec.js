import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.CONTACT_CANAL_AND_RIVER_TRUST
const pageTitle = 'Contact the Canal & River Trust'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response for ${url}`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })

    it(`Should display the contact information for ${url}`, async () => {
      const response = await submitGetRequest({ url }, pageTitle)

      expect(response.payload).toContain('If you think there is a flood or something that might cause a flood of a canal')
      expect(response.payload).toContain('https://canalrivertrust.org.uk/contact-us')
      expect(response.payload).toContain('Call 999 if you or someone else is in immediate danger.')
    })
  })
})
