import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_FIND_ADDRESS

describe(url, () => {
  describe('GET', () => {
    it('renders the find address page', async () => {
      await submitGetRequest({ url }, 'Find address')
    })
  })
})
