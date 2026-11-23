import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_CONFIRM_SITE },
  { problem: 'noise', url: constants.routes.NOISE_CONFIRM_SITE },
  { problem: 'dust', url: constants.routes.DUST_CONFIRM_SITE },
  { problem: 'litter', url: constants.routes.LITTER_CONFIRM_SITE },
  { problem: 'mud', url: constants.routes.MUD_CONFIRM_SITE },
  { problem: 'vermin/pests', url: constants.routes.PESTS_CONFIRM_SITE }
]

describe('RARS Confirm Site Routes', () => {
  describe.each(problems)('$problem confirm site', ({ url }) => {
    it('renders the confirm site page', async () => {
      const response = await submitGetRequest({ url }, 'Confirm site', constants.statusCodes.OK)
      expect(response.payload).toContain('<h1 class="govuk-heading-l">Confirm site</h1>')
    })
  })
})
