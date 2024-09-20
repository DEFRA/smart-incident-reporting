import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-smell.js'
jest.mock('../../../services/service-bus.js')

const url = constants.routes.SMELL_OTHER_INFORMATION
const header = 'Is there anything else you\'d like to add (optional)?'
const enterTheAddress = 'Enter the address'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Should accept and store a description', async () => {
      const otherInfo = 'This is a description of the odour'
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
          reportType: 200,
          reporterName: 'John Smith',
          reporterPhoneNumber: '012345678910',
          reporterAccessCode: 'password',
          otherDetails: otherInfo,
          questionSetId: 200,
          data: expect.arrayContaining([
            expect.objectContaining({ questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1401, otherDetails: 'Test address 1' }),
            expect.objectContaining({ questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1402, otherDetails: 'test address 2' }),
            expect.objectContaining({ questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1403, otherDetails: 'city' }),
            expect.objectContaining({ questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1404, otherDetails: 'county' }),
            expect.objectContaining({ questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1405, otherDetails: 'M6 7PW' }),
            expect.objectContaining({ questionId: 1400, questionAsked: enterTheAddress, questionResponse: true, answerId: 1406 }),
            expect.objectContaining({ questionId: 1600, questionAsked: 'Do you know where the smell is coming from?', questionResponse: true, answerId: 1601 }),
            expect.objectContaining({ questionId: 1600, questionAsked: 'Do you know where the smell is coming from?', questionResponse: true, answerId: 1603, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 1700, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 1701 }),
            expect.objectContaining({ questionId: 1700, questionAsked: 'How would you describe the smell?', questionResponse: true, answerId: 1703 }),
            expect.objectContaining({ questionId: 1800, questionAsked: 'Have you reported the smell before?', questionResponse: true, answerId: 1802 }),
            expect.objectContaining({ questionId: 1900, questionAsked: 'Has the same smell caused you a problem before?', questionResponse: true, answerId: 1901 }),
            expect.objectContaining({ questionId: 2000, questionAsked: 'How long has the smell been causing problems?', questionResponse: true, answerId: 2001, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 2100, questionAsked: 'Is the smell still there?', questionResponse: true, answerId: 2101 }),
            expect.objectContaining({ questionId: 2200, questionAsked: 'How strong is the smell?', questionResponse: true, answerId: 2201 }),
            expect.objectContaining({ questionId: 2300, questionAsked: 'Has the smell stopped you from doing any of the following?', questionResponse: true, answerId: 2301 }),
            expect.objectContaining({ questionId: 2400, questionAsked: 'Have any of the following happened?', questionResponse: true, answerId: 2401 }),
            expect.objectContaining({ questionId: 2500, questionAsked: 'Did the smell cause any of the following?', questionResponse: true, answerId: 2501 })

            // FILL this out when we have the correct question and answer IDs, as a lot of manual
          ])
        })
      }))
      expect(response.request.yar.get(constants.redisKeys.SMELL_OTHER_INFORMATION)).toEqual(otherInfo)
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
