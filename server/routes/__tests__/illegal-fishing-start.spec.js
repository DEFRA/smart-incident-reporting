import { submitGetRequest } from '../../__test-helpers__/server.js'
import { expectStartPageContent } from '../../__test-helpers__/start-page.js'
import constants from '../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_START
const header = 'Report illegal fishing in England'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      expectStartPageContent(response.payload, {
        startHref: constants.routes.ILLEGAL_FISHING,
        sectionIds: ['before-you-start', 'report-illegal-fishing', 'report-illegal-fishing-by-phone', 'after-youve-reported-the-problem', 'report-other-environmental-problems'],
        links: [
          'https://www.nidirect.gov.uk/articles/report-illegal-fishing-or-make-complaint',
          'https://www.gov.uk/report-environmental-problem'
        ]
      })
    })
  })
})
