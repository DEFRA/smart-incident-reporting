import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-blockage.js'
jest.mock('../../../services/service-bus.js')

const url = constants.routes.BLOCKAGE_OTHER_INFORMATION
const header = 'Is there anything else you\'d like to add?'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })

  describe('POST', () => {
    const otherInfo = 'This is a description of the blockage'
    const options = {
      url,
      payload: {
        otherInfo
      }
    }

    it('Should call sendMessage once', async () => {
      await submitPostRequest(options, 302, session)
      expect(sendMessage).toHaveBeenCalledTimes(1)
    })

    it('Should send message with correct payload structure', async () => {
      await submitPostRequest(options, 302, session)
      expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({
        info: expect.any(Function)
      }),
      expect.objectContaining({
        reportingAnEnvironmentalProblem: expect.objectContaining({
          reportType: 300,
          reporterName: 'John Smith',
          reporterPhoneNumber: '012345678910',
          reporterEmailAddress: 'test@test.com',
          otherDetails: otherInfo,
          questionSetId: 300,
          data: expect.arrayContaining([
            expect.objectContaining({ questionId: 5000, questionAsked: 'Is the blockage in a river?', questionResponse: true, answerId: 5001 }),
            expect.objectContaining({ questionId: 500, questionAsked: 'Do you know the name of the river?', questionResponse: true, answerId: 501 }),
            expect.objectContaining({ questionId: 500, questionAsked: 'Do you know the name of the river?', questionResponse: true, answerId: 509, otherDetails: 'River Thames' }),
            expect.objectContaining({ questionId: 110, questionAsked: 'What\'s blocking the river?', questionResponse: true, answerId: 112 }),
            expect.objectContaining({ questionId: 2600, questionAsked: 'How do you want to tell us where the blockage is?', questionResponse: true, answerId: 2601 }),
            expect.objectContaining({ questionId: 900, questionAsked: 'Location description', questionResponse: true, answerId: 901, otherDetails: 'Near the bridge on High Street' }),
            expect.objectContaining({ questionId: 120, questionAsked: 'Has the blockage been here for some time?', questionResponse: true, answerId: 121 }),
            expect.objectContaining({ questionId: 120, questionAsked: 'Has the blockage been here for some time?', questionResponse: true, answerId: 124, otherDetails: 'About 2 weeks' }),
            expect.objectContaining({ questionId: 130, questionAsked: 'How much of the river is blocked?', questionResponse: true, answerId: 131 }),
            expect.objectContaining({ questionId: 140, questionAsked: 'Is water building up behind the blockage?', questionResponse: true, answerId: 141 }),
            expect.objectContaining({ questionId: 150, questionAsked: 'Will the blockage cause a flood if it is not removed?', questionResponse: true, answerId: 152 }),
            expect.objectContaining({ questionId: 160, questionAsked: 'What is at risk from flooding?', questionResponse: true, answerId: 163 }),
            expect.objectContaining({ questionId: 180, questionAsked: 'Do you know who is responsible for causing the blockage?', questionResponse: true, answerId: 182 }),
            expect.objectContaining({ questionId: 2800, questionAsked: 'Do you want to send us any photos of the problem?', questionResponse: true, answerId: 2802 })
          ])
        })
      }))
    })

    it('Should save otherInfo to session', async () => {
      const response = await submitPostRequest(options, 302, session)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION)).toEqual(otherInfo)
    })

    it('Should save submission timestamp to session', async () => {
      const response = await submitPostRequest(options, 302, session)
      expect(new Date(response.request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP))).toBeInstanceOf(Date)
    })

    it('Should redirect to start page', async () => {
      const response = await submitPostRequest(options, 302, session)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
    })

    it('Should error if validatePayload fails', async () => {
      const { submitPostRequest } = await import('../../../__test-helpers__/server.js')
      const helpers = await import('../../../utils/helpers.js')
      helpers.validatePayload = jest.fn().mockImplementation(() => {
        return false
      })

      const otherInfo = 'This is a description of the blockage'
      const options = {
        url,
        payload: {
          otherInfo
        }
      }
      const response = await submitPostRequest(options, 500)
      expect(response.statusCode).toBe(500)
    })
  })
})
