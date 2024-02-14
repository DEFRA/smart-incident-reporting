import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
import { session } from '../../../__mock-data__/session-water-pollution.js'
jest.mock('../../../services/service-bus.js')

const url = constants.routes.WATER_POLLUTION_OTHER_INFORMATION
const header = 'Can you describe the pollution?'

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
            })
          ])
        })
      }))
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION)).toEqual(otherInfo)
      expect(new Date(response.request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP))).toBeInstanceOf(Date)
    })
    it('Should return view and error message if no description is provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(sendMessage).toHaveBeenCalledTimes(0)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a description of the pollution')
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
