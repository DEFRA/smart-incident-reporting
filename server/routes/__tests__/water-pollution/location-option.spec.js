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

const sessionData = {
  'water-pollution/location-option': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.description.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Where did you see the pollution?')
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Where did you see the pollution?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="2601" checked>')
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
    it('Should accept description option and redirect to water-pollution/location-description even with referrer set', async () => {
      const answerId = question.answers.description.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
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
