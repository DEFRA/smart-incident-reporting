import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_NUMBER_OF_FISH
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_NUMBER_OF_FISH
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, question.text)
    })
  })
  describe('POST', () => {
    it('Happy accepts 5 or more and redirects to illegal-fishing/angling-trust', async () => {
      const answerId = question.answers.fiveOrMore.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_ANGLING_TRUST)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_NUMBER_OF_FISH)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy accepts Less than 5 and redirects to illegal-fishing/angling-trust', async () => {
      const answerId = question.answers.lessThanFive.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_ANGLING_TRUST)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_NUMBER_OF_FISH)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy accepts You do not know and redirects to illegal-fishing/angling-trust', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_ANGLING_TRUST)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_NUMBER_OF_FISH)).toEqual([{
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
      expect(response.payload).toContain('Select how many fish or &#39;you do not know&#39;')
    })
  })
})
