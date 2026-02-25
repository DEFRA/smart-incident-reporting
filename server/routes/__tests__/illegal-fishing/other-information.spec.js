import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-illegal-fishing.js'
jest.mock('../../../services/service-bus.js')

const url = constants.routes.ILLEGAL_FISHING_OTHER_INFORMATION
const header = 'Is there anything else you\'d like to add?'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Should accept and store a description', async () => {
      const otherInfo = 'This is a description of the illegal fishing activity'
      const options = {
        url,
        payload: {
          otherInfo
        }
      }
      const response = await submitPostRequest(options, 302, session)
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({
        info: expect.any(Function)
      }),
      expect.objectContaining({
        reportingAnEnvironmentalProblem: expect.objectContaining({
          reportType: 1800,
          reporterName: 'John Smith',
          reporterPhoneNumber: '012345678910',
          reporterEmailAddress: 'test@test.com',
          otherDetails: otherInfo,
          questionSetId: 1800,
          data: expect.arrayContaining([
            expect.objectContaining({ questionId: 500, questionAsked: 'In what kind of water have you seen illegal fishing?', questionResponse: true, answerId: 501 }),
            expect.objectContaining({ questionId: 500, questionAsked: 'In what kind of water have you seen illegal fishing?', questionResponse: true, answerId: 509, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 4200, questionAsked: 'What illegal fishing activity do you want to report?', questionResponse: true, answerId: 4202 }),
            expect.objectContaining({ questionId: 4200, questionAsked: 'What illegal fishing activity do you want to report?', questionResponse: true, answerId: 4204 }),
            expect.objectContaining({ questionId: 4200, questionAsked: 'What illegal fishing activity do you want to report?', questionResponse: true, answerId: 4206 }),
            expect.objectContaining({ questionId: 4200, questionAsked: 'What illegal fishing activity do you want to report?', questionResponse: true, answerId: 4207, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 4210, questionAsked: 'How do you know the people fishing do not have a rod licence?', questionResponse: true, answerId: 4211, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 2600, questionAsked: 'How do you want to tell us where you\'ve seen illegal fishing?', questionResponse: true, answerId: 2601 }),
            expect.objectContaining({ questionId: 900, questionAsked: 'Describe the location where you\'ve seen illegal fishing?', questionResponse: true, answerId: 901, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 4250, questionAsked: 'Can you describe anyone involved?', questionResponse: true, answerId: 4251 }),
            expect.objectContaining({ questionId: 4260, questionAsked: 'Describe the people involved?', questionResponse: true, answerId: 4261, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 4240, questionAsked: 'What illegal equipment is being used?', questionResponse: true, answerId: 4241 }),
            expect.objectContaining({ questionId: 4240, questionAsked: 'What illegal equipment is being used?', questionResponse: true, answerId: 4243 }),
            expect.objectContaining({ questionId: 4240, questionAsked: 'What illegal equipment is being used?', questionResponse: true, answerId: 4245 }),
            expect.objectContaining({ questionId: 4240, questionAsked: 'What illegal equipment is being used?', questionResponse: true, answerId: 4247, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 4230, questionAsked: 'What type of fish are being caught or targeted?', questionResponse: true, answerId: 4231 }),
            expect.objectContaining({ questionId: 4230, questionAsked: 'What type of fish are being caught or targeted?', questionResponse: true, answerId: 4233 }),
            expect.objectContaining({ questionId: 4230, questionAsked: 'What type of fish are being caught or targeted?', questionResponse: true, answerId: 4235 }),
            expect.objectContaining({ questionId: 4215, questionAsked: 'Did you see fish being \'taken\'?', questionResponse: true, answerId: 4216 }),
            expect.objectContaining({ questionId: 4220, questionAsked: 'How many fish?', questionResponse: true, answerId: 4221 }),
            expect.objectContaining({ questionId: 2800, questionAsked: 'Do you want to send us any images or videos of the pollution?', questionResponse: true, answerId: 2801 }),
            expect.objectContaining({ questionId: 4300, questionAsked: 'Are you an Angling Trust volunteer?', questionResponse: true, answerId: 4301 })
          ])
        })
      }))
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_OTHER_INFORMATION)).toEqual(otherInfo)
      expect(new Date(response.request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP))).toBeInstanceOf(Date)
      expect(response.headers.location).toEqual(constants.routes.REPORT_SENT)
    })
    it('Should error if validatePayload fails', async () => {
      const { submitPostRequest } = await import('../../../__test-helpers__/server.js')
      const helpers = await import('../../../utils/helpers.js')
      helpers.validatePayload = jest.fn().mockImplementation(() => {
        return false
      })

      const otherInfo = 'This is a description of the illegal fishing activity'
      const options = {
        url,
        payload: {
          otherInfo
        }
      }
      await submitPostRequest(options, 500)
    })
  })
})
