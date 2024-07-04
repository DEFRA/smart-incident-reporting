import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
jest.mock('../../utils/is-working-hours', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(false)) // outside of working hours
}))

const url = constants.routes.SERVICE_UNAVAILABLE

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url} when outside office working hours`, async () => {
      await submitGetRequest({ url }, 'Sorry, the service is unavailable')
    })
  })
})
