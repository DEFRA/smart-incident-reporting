import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_APPEARANCE
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
    it('Happy: accepts valid answerIds and redirects to WATER_POLLUTION_LESS_THAN_10_METRES if flowing water feature', async () => {
      const answerId = [
        question.answers.cloudy.answerId,
        question.answers.scum.answerId
      ]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, 302, {
        'water-pollution/water-feature': [{
          questionId: 500,
          answerId: 501 // A River
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: answerId[0]
      }, {
        ...baseAnswer,
        answerId: answerId[1]
      }])
    })
    it('Happy: accepts valid answerIds and redirects to WATER_POLLUTION_LESS_THAN_100_SQ_METRES if static water feature', async () => {
      const answerId = [
        question.answers.cloudy.answerId,
        question.answers.scum.answerId
      ]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, 302, {
        'water-pollution/water-feature': [{
          questionId: 500,
          answerId: 503 // The sea
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: answerId[0]
      }, {
        ...baseAnswer,
        answerId: answerId[1]
      }])
    })
    it('Happy: accepts valid answerId with something else details', async () => {
      const somethingElseDetail = 'Something else details'
      const answerId = [
        question.answers.cloudy.answerId,
        question.answers.scum.answerId,
        question.answers.somethingElse.answerId
      ]
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetail
        }
      }
      const response = await submitPostRequest(options, 302, {
        'water-pollution/water-feature': [{
          questionId: 500,
          answerId: 501 // A River
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: answerId[0]
      }, {
        ...baseAnswer,
        answerId: answerId[1]
      }, {
        ...baseAnswer,
        answerId: answerId[2]
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetail.answerId,
        otherDetails: somethingElseDetail
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select what the pollution looks like')
    })
  })
})
