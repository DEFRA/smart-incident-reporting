import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { sendMessage } from '../../../services/service-bus.js'
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
      const response = await submitPostRequest(options)
      expect(sendMessage).toHaveBeenCalledTimes(1)
      // TODO test what sendMessage has been called with 
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
  })
})
