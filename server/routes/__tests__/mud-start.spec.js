import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.MUD_START
const header = 'Report mud from a waste facility, industrial site or farm in England'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })
})
