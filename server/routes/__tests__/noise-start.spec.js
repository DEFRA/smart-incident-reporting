import { submitGetRequest } from '../../__test-helpers__/server.js'
import { expectStartPageContent } from '../../__test-helpers__/start-page.js'
import constants from '../../utils/constants.js'

const url = constants.routes.NOISE_START
const header = 'Report noise from a waste facility, industrial site or farm in England'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      expectStartPageContent(response.payload, {
        startHref: constants.routes.NOISE,
        sectionIds: ['report-other-types-of-noise', 'before-you-start', 'report-noise-online', 'report-noise-by-phone', 'after-youve-reported-the-problem'],
        links: [
          'https://www.nidirect.gov.uk/information-and-services/environment-and-outdoors/environmental-quality-your-area',
          'https://www.gov.uk/find-local-council',
          'https://www.gov.uk/government/publications/environment-agency-customer-service-commitment/environment-agency-customer-service-commitment#responding-to-environmental-incidents'
        ]
      })
    })
  })
})
