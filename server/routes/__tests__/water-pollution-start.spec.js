import { submitGetRequest } from '../../__test-helpers__/server.js'
import { expectStartPageContent } from '../../__test-helpers__/start-page.js'
import constants from '../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_START
const header = 'Report water pollution in England'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      expectStartPageContent(response.payload, {
        startHref: constants.routes.WATER_POLLUTION,
        sectionIds: ['before-you-start', 'report-water-pollution', 'report-water-pollution-by-phone', 'after-youve-reported-the-problem', 'report-other-environmental-problems'],
        links: [
          'https://www.nidirect.gov.uk/articles/report-polluted-land-and-water',
          'https://www.gov.uk/find-local-council',
          'https://www.gov.uk/report-environmental-problem'
        ]
      })
    })
  })
})
