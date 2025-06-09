import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-smell.js'
jest.mock('../../../services/service-bus.js')

const url = constants.routes.SMELL_OTHER_INFORMATION
const header = 'Is there anything else you\'d like to add (optional)?'

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
        info: expect.any(Function)
      }),
      expect.objectContaining({
        reportingAnEnvironmentalProblem: expect.objectContaining({
          reportType: 200,
          reporterName: 'John Smith',
          reporterPhoneNumber: '012345678910',
          reporterEmailAddress: 'test@test.com',
          otherDetails: otherInfo,
          questionSetId: 200,
          data: expect.arrayContaining([
            expect.objectContaining({ questionId: 1600, questionAsked: 'Where is the smell coming from?', questionResponse: true, answerId: 1601 }),
            expect.objectContaining({ questionId: 3200, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 3202, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 3200, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 3203, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 3200, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 3204, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 3200, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 3205, otherDetails: 'm11mm' }),
            expect.objectContaining({ questionId: 3100, questionAsked: 'Is the smell affecting you at home?', questionResponse: true, answerId: 3001 }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter your address', questionResponse: true, answerId: 1401, otherDetails: 'address 1' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter your address', questionResponse: true, answerId: 1402, otherDetails: 'address 2' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter your address', questionResponse: true, answerId: 1403, otherDetails: 'town' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter your address', questionResponse: true, answerId: 1404, otherDetails: 'county' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter your address', questionResponse: true, answerId: 1405, otherDetails: 'm11mm' }),
            expect.objectContaining({ questionId: 1900, questionAsked: 'Has this smell caused you problems before?', questionResponse: true, answerId: 1901 }),
            expect.objectContaining({ questionId: 2100, questionAsked: 'Is the smell still there?', questionResponse: true, answerId: 2101 }),
            expect.objectContaining({ questionId: 2200, questionAsked: 'How strong is the smell?', questionResponse: true, answerId: 2203 }),
            expect.objectContaining({ questionId: 3000, questionAsked: 'Is the smell noticeable indoors?', questionResponse: true, answerId: 3001 }),
            expect.objectContaining({ questionId: 3500, questionAsked: 'Do you want to send us any images or videos of the problem?', questionResponse: true, answerId: 3501 }),
            expect.objectContaining({ questionId: 3600, questionAsked: 'Does the smell stick to your clothing or hair?', questionResponse: true, answerId: 3601 }),
            expect.objectContaining({ questionId: 2400, questionAsked: 'Did you do any of the following because of the smell?', questionResponse: true, answerId: 2401 }),
            expect.objectContaining({ questionId: 2500, questionAsked: 'Did the smell cause any of these health problems?', questionResponse: true, answerId: 2501 })
          ])
        })
      }))
      expect(response.request.yar.get(constants.redisKeys.SMELL_OTHER_INFORMATION)).toEqual(otherInfo)
      expect(new Date(response.request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP))).toBeInstanceOf(Date)
      expect(response.headers.location).toEqual(constants.routes.REPORT_SENT)
    })
    it('Should error if validatePayload fails', async () => {
      const { submitPostRequest } = await import('../../../__test-helpers__/server.js')
      const helpers = await import('../../../utils/helpers.js')
      helpers.validatePayload = jest.fn().mockImplementation(() => {
        return false
      })

      const otherInfo = 'This is a description of the odour'
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
