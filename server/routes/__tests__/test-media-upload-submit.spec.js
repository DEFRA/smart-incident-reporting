import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'

const url = constants.routes.TEST_MEDIA_UPLOAD_SUBMIT
const header = 'Select journey to submit'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url} if current smell`, async () => {
      await submitGetRequest({ url }, header, constants.statusCodes.OK)
    })
  })

  describe('POST', () => {
    it('Should redirect to report sent when journey selected', async () => {
      const journeyId = 2801
      const options = {
        url,
        payload: {
          journey: journeyId
        }
      }
      const response = await submitPostRequest(options)
      // Test a couple of the session values to check that the session is being set correctly
      // It's only a testing route so no need to check all session values
      expect(response.headers.location).toEqual(constants.routes.REPORT_SENT)
      expect(response.request.yar.get(constants.redisKeys.QUESTION_SET_ID)).toEqual(journeyId)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS)).toEqual({ reporterEmailAddress: 'not-a-real-email-address' })
    })
  })
})
