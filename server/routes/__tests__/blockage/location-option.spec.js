import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_LOCATION_OPTION
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_LOCATION_OPTION
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/location-option': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.description.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'How do you want to tell us where the blockage is?')
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'How do you want to tell us where the blockage is?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-3" name="answerId" type="radio" value="2601" checked>')
    })
  })
  describe('POST', () => {
    it('Should accept current location option and redirect to blockage/current-location', async () => {
      const answerId = question.answers.currentLocation.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_MAP)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept map option and redirect to blockage/location-map', async () => {
      const answerId = question.answers.map.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_MAP)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept map option and redirect to blockage/location-description', async () => {
      const answerId = question.answers.description.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_OPTION)).toEqual([{
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
      expect(response.payload).toContain('Select how you want to give the location')
    })
  })
})
