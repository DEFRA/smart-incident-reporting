import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { sendMessage } from '../../services/service-bus.js'
import { session } from '../../__mock-data__/session-water-pollution.js'
jest.mock('../../services/service-bus.js')

const url = constants.routes.FEEDBACK
const refererUrl = 'http://localhost:3000/water-pollution'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Give feedback on the Report an environmental problem service')
      expect(response.request.yar.get(constants.redisKeys.FEEDBACK).feedbackURL).toEqual('')
    })
    it(`Should return success response and correct view for ${url} and set the feedbackURL`, async () => {
      const options = {
        url,
        headers: {
          referer: refererUrl
        }
      }
      const response = await submitGetRequest(options, 'Give feedback on the Report an environmental problem service')
      expect(response.request.yar.get(constants.redisKeys.FEEDBACK).feedbackURL).toEqual(refererUrl)
    })
  })
  describe('POST', () => {
    it('Should successfully post valid feedback including feedback referer url', async () => {
      const feedbackURL = refererUrl
      session[constants.redisKeys.FEEDBACK] = {
        feedbackURL
      }
      const options = {
        url,
        payload: {
          feedback: 'vsatisfied',
          otherInfo: 'This is test feedback'
        }
      }
      const response = await submitPostRequest(options, 302, session)
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({
        givingFeedbackToAEnvironmentalProblemReport: expect.objectContaining({
          feedbackRating: 'vsatisfied',
          feedbackText: 'This is test feedback',
          feedbackURL
        })
      }), '-feedback')
      expect(response.request.yar.get(constants.redisKeys.FEEDBACK).feedbackURL).toEqual(feedbackURL)
    })
    it('Should fail validation if no radio selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how you feel about the service')
    })
    it('Should fail if payload validation fails', async () => {
      session[constants.redisKeys.FEEDBACK] = {
        feedbackURL: false
      }
      const options = {
        url,
        payload: {
          feedback: 'vsatisfied',
          otherInfo: 'This is test feedback'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.PROBLEM_WITH_SERVICE, session)
      expect(response.payload).toContain('Sorry, there is a problem with the service')
    })
  })
})
