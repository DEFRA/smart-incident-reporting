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
        reportingAnEnvironmentalProblem: expect.objectContaining({
          reportType: 200,
          reporterName: 'John Smith',
          reporterPhoneNumber: '012345678910',
          reporterAccessCode: 'password',
          reporterEmailAddress: 'test@test.com',
          otherDetails: otherInfo,
          questionSetId: 200,
          data: expect.arrayContaining([
            expect.objectContaining({ questionId: 1600, questionAsked: 'Where is the smell coming from?', questionResponse: true, answerId: 1601 }),
            expect.objectContaining({ questionId: 32000, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 32002, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 32000, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 32003, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 32000, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 32004, otherDetails: 'test' }),
            expect.objectContaining({ questionId: 32000, questionAsked: 'Can you give details about where the smell is coming from?', questionResponse: true, answerId: 32005, otherDetails: 'm11mm' }),
            expect.objectContaining({ questionId: 3100, questionAsked: 'Is the smell affecting you at home?', questionResponse: true, answerId: 30001 }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter the address', questionResponse: true, answerId: 1401, otherDetails: 'address 1' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter the address', questionResponse: true, answerId: 1402, otherDetails: 'address 2' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter the address', questionResponse: true, answerId: 1403, otherDetails: 'town' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter the address', questionResponse: true, answerId: 1404, otherDetails: 'county' }),
            expect.objectContaining({ questionId: 1400, questionAsked: 'Enter the address', questionResponse: true, answerId: 1405, otherDetails: 'm11mm' }),
            expect.objectContaining({ questionId: 1900, questionAsked: 'Has this smell caused you problems before?', questionResponse: true, answerId: 1901 }),
            expect.objectContaining({ questionId: 2100, questionAsked: 'Is the smell still there?', questionResponse: true, answerId: 2101 }),
            expect.objectContaining({ questionId: 2200, questionAsked: 'How strong is the smell?', questionResponse: true, answerId: 2203 }),
            expect.objectContaining({ questionId: 3000, questionAsked: 'Is the smell noticeable indoors?', questionResponse: true, answerId: 30001 }),
            expect.objectContaining({ questionId: 1, questionAsked: 'Can we contact you for more information if needed?', questionResponse: true, answerId: 2 }),
            expect.objectContaining({ questionId: 1, questionAsked: 'Do you want to send us any images or videos of the problem?', questionResponse: true, answerId: 2 })
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