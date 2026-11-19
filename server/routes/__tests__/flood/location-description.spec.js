import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_LOCATION_DESCRIPTION

describe(url, () => {
  describe('GET', () => {
    it('renders the location description page', async () => {
      await submitGetRequest({ url }, 'Location Description')
    })
  })
})
