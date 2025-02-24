import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FISHING_LOCATION_DESCRIPTION
const question = questionSets.FISHING.questions.FISHING_LOCATION_DESCRIPTION
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Happy: accept and store a location description', async () => {
      const locationDescription = 'This is a description of the location of illegal fishing'
      const options = {
        url,
        payload: {
          locationDescription
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_PEOPLE_FISHING)
      expect(response.request.yar.get(constants.redisKeys.FISHING_LOCATION_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        otherDetails: locationDescription
      }])
    })
    it('Sad: errors on no locationDescription provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a description of where you&#39;ve seen illegal fishing')
    })
  })
})
