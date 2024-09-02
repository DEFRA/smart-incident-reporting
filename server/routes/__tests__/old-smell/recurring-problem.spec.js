import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_RECURRING_PROBLEM
const question = questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM
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
    it('Happy accepts yes and redirects to SMELL_PAST', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PAST)
      expect(response.request.yar.get(constants.redisKeys.SMELL_RECURRING_PROBLEM)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy accepts occasionally and redirects to SMELL_PAST', async () => {
      const answerId = question.answers.occasionally.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PAST)
      expect(response.request.yar.get(constants.redisKeys.SMELL_RECURRING_PROBLEM)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy accepts No and redirects to SMELL_DATE_TIME', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_DATE_TIME)
      expect(response.request.yar.get(constants.redisKeys.SMELL_RECURRING_PROBLEM)).toEqual([{
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
      expect(response.payload).toContain('Select yes if the smell has caused you a problem before')
    })
  })
})
