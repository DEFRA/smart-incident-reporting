import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { session } from '../../__mock-data__/session-water-pollution.js'

const url = constants.routes.FEEDBACK_SUCCESS

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url} with link to return to referer`, async () => {
      session[constants.redisKeys.FEEDBACK] = {
        feedbackURL: 'http://localhost:3000/water-pollution'
      }
      const response = await submitGetRequest({ url }, 'Thank you for your feedback', constants.statusCodes.OK, session)
      expect(response.payload).toContain('<a href="http://localhost:3000/water-pollution">Go back to the page you were looking at</a>.')
    })
    it(`Should return success response and correct view for ${url} with link to start`, async () => {
      session[constants.redisKeys.FEEDBACK] = {
        feedbackURL: 'http://localhost:3000/report-sent'
      }
      const response = await submitGetRequest({ url }, 'Thank you for your feedback', constants.statusCodes.OK, session)
      expect(response.payload).toContain('<a href="/">Return to the start of the service</a>.')
    })
  })
})
