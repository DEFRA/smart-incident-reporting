import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_LOCATION_OPTION
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_LOCATION_OPTION
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
    // Happy accepts map and redirects to location-map
    it('Should accept map option and redirect to illegal-fishing/location-map', async () => {
      const answerId = question.answers.map.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_MAP)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })

    // Happy accepts description and redirects to description
    it('Should accept description option and redirect to illegal-fishing/location-description', async () => {
      const answerId = question.answers.description.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    // Sad no option selected, shows error message
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how you want to give the location')
    })
  })
})
