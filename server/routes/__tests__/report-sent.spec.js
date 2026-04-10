import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
// import config from '../../utils/config.js'
import reportSentRoutes from '../report-sent.js'

const url = constants.routes.REPORT_SENT
const header = 'Report sent'
const submissionTimestamp = '2026-04-09T09:00:00.000Z'
const sessionId = 'test-session-id'

const handler = async questionSetID => {
  const set = jest.fn()
  const view = jest.fn()

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
  }, { view })

  return { set, view }
}

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
      const { set } = await handler(questionSetID)

      expect(set).toHaveBeenCalledWith(sessionId, {
        journey: expectedJourney,
        dateTime: submissionTimestamp
      })
    })

    it('should pass mediaUploadLink', async () => {
      const { view } = await handler(100)

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        mediaUploadLink: 'https://sir-uploader-dev1.azure.defra.cloud/upload-photo'
        // mediaUploadLink: config.mediaUploadUrl
      }))
    })
  })
})
