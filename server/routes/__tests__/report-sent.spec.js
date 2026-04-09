import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import reportSentRoutes from '../report-sent.js'

const url = constants.routes.REPORT_SENT
const header = 'Report sent'
const submissionTimestamp = '2026-04-09T09:00:00.000Z'
const sessionId = 'test-session-id'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })

    it.each([
      { questionSetID: 100, expectedJourney: 'water pollution' },
      { questionSetID: 200, expectedJourney: 'smell' },
      { questionSetID: 300, expectedJourney: 'blockage' },
      { questionSetID: 1800, expectedJourney: 'illegal fishing' }
    ])('should cache journey "$expectedJourney" for questionSetID $questionSetID', async ({ questionSetID, expectedJourney }) => {
      const set = jest.fn()
      await reportSentRoutes[0].handler({
        yar: {
          get: jest.fn(key => ({
            [constants.redisKeys.QUESTION_SET_ID]: questionSetID,
            [constants.redisKeys.SUBMISSION_TIMESTAMP]: submissionTimestamp
          }[key])),
          id: sessionId,
          reset: jest.fn()
        },
        server: {
          cache: jest.fn(() => ({ set }))
        }
      }, { view: jest.fn() })

      expect(set).toHaveBeenCalledWith(sessionId, {
        journey: expectedJourney,
        dateTime: submissionTimestamp
      })
    })
  })
})
