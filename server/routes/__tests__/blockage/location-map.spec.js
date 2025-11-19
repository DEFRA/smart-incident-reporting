import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_LOCATION_MAP
const header = 'Location Map-TODO'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      console.log(header)
      await submitGetRequest({ url }, header)
    })
  })
})
