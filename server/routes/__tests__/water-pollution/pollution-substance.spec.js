import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.WATER_POLLUTION_POLLUTION_SUBSTANCE
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_SUBSTANCE
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, baseAnswer.questionAsked)
    })
  })

  describe('POST', () => {
    it('Happy: accepts valid single answerID (non array) and redirects to WATER_POLLUTION_POLLUTION_APPEARANCE', async () => {
      const answerId = question.answers.sewage.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }])
    })
    it('Happy: accepts valid array of answerID and redirects to WATER_POLLUTION_POLLUTION_APPEARANCE', async () => {
      const answerId = [question.answers.sewage.answerId.toString(), question.answers.chemical.answerId.toString(), question.answers.rural.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.chemical.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.rural.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with something else and other details and redirects to WATER_POLLUTION_POLLUTION_APPEARANCE', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetail: 'something else'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetail.answerId,
        otherDetails: 'something else'
      }])
    })
    it('Happy: accepts empty answerId, defaults to you do not know and redirects to WATER_POLLUTION_POLLUTION_APPEARANCE', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.unknown.answerId
      }])
    })
  })
})
