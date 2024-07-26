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
    it('Happy: accepts valid single answerID (non array) and redirects to WATER_POLLUTION_IMAGES_OR_VIDEO', async () => {
      const answerId = question.answers.cloudy.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.cloudy.answerId
      }])
    })
    it('Happy: accepts valid answerIds and redirects to WATER_POLLUTION_IMAGES_OR_VIDEO', async () => {
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
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO)
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
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO)
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
