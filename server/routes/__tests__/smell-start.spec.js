import { submitGetRequest } from '../../__test-helpers__/server.js'
import { expectStartPageContent } from '../../__test-helpers__/start-page.js'
import constants from '../../utils/constants.js'

const url = constants.routes.SMELL_START
const header = 'Report a smell'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      expectStartPageContent(response.payload, {
        startHref: constants.routes.SMELL,
        sectionIds: ['report-other-types-of-smells', 'before-you-start', 'report-a-smell-online', 'report-a-smell-by-phone', 'after-youve-reported-the-problem'],
        links: [
          'https://www.nidirect.gov.uk/information-and-services/environment-and-outdoors/environmental-quality-your-area',
          'https://www.gov.uk/find-local-council',
          'https://www.gov.uk/government/publications/environment-agency-customer-service-commitment/environment-agency-customer-service-commitment#responding-to-environmental-incidents'
        ]
      })
    })
  })
})
