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

const sessionData = {
  'fishing/location-description': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.locationDetails.answerId,
    otherDetails: 'test details'
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('test details</textarea>')
    })
  })

  describe('POST', () => {
    it('Happy: accept and store a location description', async () => {
      const locationDescription = 'Description of illegal fishing'
      const options = {
        url,
        payload: {
          locationDescription
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_PEOPLE_FISHING)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION)).toEqual([{
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
      expect(response.payload).toContain('Enter a description of where you\'ve seen illegal fishing')
    })
  })
})
