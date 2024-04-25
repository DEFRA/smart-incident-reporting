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
      const otherDetails = 'This is a description of the odour'
      const options = {
        url,
        payload: {
          otherDetails
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
          otherDetails,
          questionSetId: 200,
          data: expect.arrayContaining([
            expect.objectContaining({
              questionId: 100,
              questionAsked: 'Enter the address',
              questionResponse: true,
              answerId: 101,
              otherDetails: 'Test address 1'
            })
            // FILL this out when we have the correct question and answer IDs, as a lot of manual
          ])
        })
      }))
      expect(response.request.yar.get(constants.redisKeys.SMELL_OTHER_INFORMATION)).toEqual(otherDetails)
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
