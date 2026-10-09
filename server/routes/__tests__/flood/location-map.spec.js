import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_LOCATION_MAP

describe(url, () => {
  describe('GET', () => {
    it('renders the location map page', async () => {
      await submitGetRequest({ url }, 'Location Map')
    })
  })
})
