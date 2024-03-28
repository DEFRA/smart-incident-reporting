import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
jest.mock('../../utils/is-working-hours', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(false)) // outside of working hours
}))
const url = '/'

describe(url, () => {
  describe('GET', () => {
    it('Should Redirect to service unavailable when outside of working hours', async () => {
      const response = await submitGetRequest({ url }, '', constants.statusCodes.REDIRECT)
      expect(response.headers.location).toEqual(constants.routes.SERVICE_UNAVAILABLE)
    })
  })
})
