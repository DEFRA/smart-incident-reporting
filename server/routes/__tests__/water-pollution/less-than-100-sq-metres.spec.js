import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LESS_THAN_100_SQ_METRES
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
    it(`Should return success response and correct view when yes is selected for ${url}`, async () => {
      const sessionData = {
        'water-pollution/less-than-100-sq-metres': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.yes.answerId
        }]
      }
      const response = await submitGetRequest({ url }, 'Does the pollution cover an area less than 100 square metres in size?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="801" checked>')
    })
    it(`Should return success response and correct view when no is selected for ${url}`, async () => {
      const sessionData = {
        'water-pollution/less-than-100-sq-metres': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.no.answerId
        }]
      }
      const response = await submitGetRequest({ url }, 'Does the pollution cover an area less than 100 square metres in size?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="802" checked>')
    })
  })
  describe('POST', () => {
    it('Happy: accepts yes and redirects to other information', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts no and redirects to pollution-length', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_AREA)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts do not know and redirects to other information', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
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
      expect(response.payload).toContain('Select yes if the pollution covers less than 100 square metres')
    })
    it('Happy: For CYA journey, accepts valid answerID for no and redirects to pollution-area', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_AREA)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: For CYA journey, accepts valid answerID for yes and redirects to check-your-answers', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: For CYA journey, accepts valid answerID for do not know and redirects to check-your-answers', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
  })
})
