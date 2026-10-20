import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_CONTACT_DETAILS

describe(url, () => {
  describe('GET', () => {
    it('Should display contact-details view', async () => {
      await submitGetRequest({ url }, 'Contact details', constants.statusCodes.OK)
    })
  })
})
