import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-water-pollution.js'
jest.mock('../../../services/service-bus.js')

const url = constants.routes.WATER_POLLUTION_OTHER_INFORMATION
const header = 'Is there anything else you\'d like to add (optional)?'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Should accept and store a description', async () => {
      const otherInfo = 'This is a description of the water pollution'
      const options = {
        url,
        payload: {
          otherInfo
        }
      }
      const response = await submitPostRequest(options, 302, session)
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({
        reportingAnEnvironmentalProblem: expect.objectContaining({
          reportType: 100,
          reporterName: 'John Smith',
          reporterPhoneNumber: '012345678910',
          reporterEmailAddress: 'test@test.com',
          reporterAccessCode: 'password',
          otherDetails: otherInfo,
          questionSetId: 100,
          data: expect.arrayContaining([
            expect.objectContaining({
              questionId: 500,
              questionAsked: 'In what kind of water is the pollution?',
              questionResponse: true,
              answerId: 506
            }),
            expect.objectContaining({
              questionId: 500,
              questionAsked: 'In what kind of water is the pollution?',
              questionResponse: true,
              answerId: 508,
              otherDetails: 'this is a test'
            }),
            expect.objectContaining({
              questionId: 700,
              questionAsked: 'Does the pollution spread less than 10 metres along the watercourse?',
              questionResponse: true,
              answerId: 702
            }),
            expect.objectContaining({
              questionId: 400,
              questionAsked: 'How far along the water feature does the pollution spread?',
              questionResponse: true,
              answerId: 403
            }),
            expect.objectContaining({
              questionId: 900,
              questionAsked: 'Where is the pollution?',
              questionResponse: true,
              answerId: 901,
              otherDetails: 'test location'
            }),
            expect.objectContaining({
              questionId: 1000,
              questionAsked: 'What does the pollution look like?',
              questionResponse: true,
              answerId: 1002
            }),
            expect.objectContaining({
              questionId: 1000,
              questionAsked: 'What does the pollution look like?',
              questionResponse: true,
              answerId: 1003
            }),
            expect.objectContaining({
              questionId: 2800,
              questionAsked: 'Do you want to send us any images or videos of the pollution?',
              questionResponse: true,
              answerId: 2801
            }),
            expect.objectContaining({
              questionId: 2900,
              questionAsked: 'What do you think the pollution is?',
              questionResponse: true,
              answerId: 2901
            }),
            expect.objectContaining({
              questionId: 2900,
              questionAsked: 'What do you think the pollution is?',
              questionResponse: true,
              answerId: 2905
            }),
            expect.objectContaining({
              questionId: 2900,
              questionAsked: 'What do you think the pollution is?',
              questionResponse: true,
              answerId: 2907
            }),
            expect.objectContaining({
              questionId: 100,
              questionAsked: 'Do you know where the pollution is coming from?',
              questionResponse: true,
              answerId: 101
            }),
            expect.objectContaining({
              questionId: 100,
              questionAsked: 'Do you know where the pollution is coming from?',
              questionResponse: true,
              answerId: 103,
              otherDetails: 'other details'
            })
          ])
        })
      }))
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION)).toEqual(otherInfo)
      expect(new Date(response.request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP))).toBeInstanceOf(Date)
    })
    it('Should error if validatePayload fails', async () => {
      const { submitPostRequest } = await import('../../../__test-helpers__/server.js')
      const helpers = await import('../../../utils/helpers.js')
      helpers.validatePayload = jest.fn().mockImplementation(() => {
        return false
      })

      const otherInfo = 'This is a description of the water pollution'
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
