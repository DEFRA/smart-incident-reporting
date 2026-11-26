import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_CONTACT_EA_OR_LOCAL_COUNCIL
const pageTitle = 'Contact the Environment Agency or your local council'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response for ${url}`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })

    it(`Should display the contact information for ${url}`, async () => {
      const response = await submitGetRequest({ url }, pageTitle)

      expect(response.payload).toContain("If you're not sure what's causing a flood")
      expect(response.payload).toContain('https://www.gov.uk/find-your-local-council')
      expect(response.payload).toContain('Environment Agency incident hotline')
      expect(response.payload).toContain('0800 80 70 60')
      expect(response.payload).toContain('Open every day, 24 hours a day')
      expect(response.payload).toContain('https://www.gov.uk/call-charges')
    })
  })
})
