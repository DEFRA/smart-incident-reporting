import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_CONTACT_LOCAL_COUNCIL
const pageTitle = 'Contact your local council'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response for ${url}`, async () => {
      const response = await submitGetRequest({ url }, pageTitle)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })

    it(`Should display the local council contact information for ${url}`, async () => {
      const response = await submitGetRequest({ url }, pageTitle)

      expect(response.payload).toContain('public drains')
      expect(response.payload).toContain('https://www.gov.uk/report-blocked-drain')
      expect(response.payload).toContain('report a flooded road')
      expect(response.payload).toContain('https://www.gov.uk/report-road-flooding')
    })
  })
})
