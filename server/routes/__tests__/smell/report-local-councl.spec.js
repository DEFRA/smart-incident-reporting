import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_REPORT_LOCAL_COUNCIL
const header = 'Report the smell to your local council'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })
})
