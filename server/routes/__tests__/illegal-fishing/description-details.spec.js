import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_DESCRIPTION_DETAILS
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_DESCRIPTION_DETAILS
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Happy: accept and store a location description', async () => {
      const descriptionDetails = 'This is a description of the people involved'
      const vehicleRegistration = 'Vehicle REG'
      const options = {
        url,
        payload: {
          descriptionDetails,
          vehicleRegistration
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_DESCRIPTION_DETAILS)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.descriptionDetails.answerId,
        otherDetails: descriptionDetails
      },
      {
        ...baseAnswer,
        answerId: question.answers.vehicleRegistration.answerId,
        otherDetails: vehicleRegistration
      }])
    })
    it('Sad: errors on no descriptionDetails provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a description of people involved')
    })
  })
})
