import { submitGetRequest } from '../../__test-helpers__/server.js'
import { expectStartPageContent } from '../../__test-helpers__/start-page.js'
import constants from '../../utils/constants.js'

const url = constants.routes.BLOCKAGE_START
const header = 'Report a blockage in a river in England'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      expectStartPageContent(response.payload, {
        startHref: constants.routes.BLOCKAGE,
        sectionIds: ['before-you-start', 'report-a-river-blockage', 'report-a-river-blockage-by-phone', 'after-youve-reported-the-problem', 'report-other-environmental-problems'],
        links: [
          'https://www.nidirect.gov.uk/articles/reporting-flooding',
          'https://www.gov.uk/find-local-council',
          'https://www.gov.uk/report-environmental-problem'
        ]
      })
    })
  })
})
