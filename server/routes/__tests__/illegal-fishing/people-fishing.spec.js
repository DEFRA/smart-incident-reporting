import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_PEOPLE_FISHING
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_PEOPLE_FISHING
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
    it('Happy accepts yes and redirects to illegal-fishing/number-of-people', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_NUMBER_OF_PEOPLE)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_PEOPLE_FISHING)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy accepts no and redirects to illegal-fishing/people-description', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_PEOPLE_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_PEOPLE_FISHING)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy accepts You do not know and redirects to illegal-fishing/people-description', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_PEOPLE_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_PEOPLE_FISHING)).toEqual([{
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
      expect(response.payload).toContain('Select &#39;yes&#39; if people are fishing at the location now')
    })
  })
})
