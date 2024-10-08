import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_LOCATION_OPTION
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LOCATION_OPTION
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Where did you see the pollution?')
    })
  })
  describe('POST', () => {
    it('Should accept map option and redirect to water-pollution/location-map', async () => {
      const answerId = question.answers.map.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LOCATION_MAP)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept description option and redirect to water-pollution/location-description', async () => {
      const answerId = question.answers.description.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how you&#39;d prefer to give the location')
    })
  })
})
