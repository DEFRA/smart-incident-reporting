import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_PAST
const question = questionSets.SMELL.questions.SMELL_PAST
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.howLong.answerId
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Happy: accept and store a how long and redirect to SMELL_DATE_TIME', async () => {
      const howLong = 'This is how long the smell has caused problems'
      const options = {
        url,
        payload: {
          howLong
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_DATE_TIME)
      expect(response.request.yar.get(constants.redisKeys.SMELL_PAST)).toEqual([{
        ...baseAnswer,
        otherDetails: howLong
      }])
    })
    it('Happy: accept and store an empty how long text box and redirect to SMELL_DATE_TIME', async () => {
      const options = {
        url,
        payload: {
          howLong: ''
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_DATE_TIME)
      expect(response.request.yar.get(constants.redisKeys.SMELL_PAST)).toEqual([{
        ...baseAnswer,
        otherDetails: ''
      }])
    })
  })
})
