import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_DESCRIPTION
const question = questionSets.SMELL.questions.SMELL_DESCRIPTION
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
  })

  describe('POST', () => {
    it('Happy accepts any combination of answer and forwards to SMELL_PREVIOUSLY_REPORTED', async () => {
      const options = {
        url,
        payload: {
          smellDescription: [
            question.answers.sewage.answerId,
            question.answers.burning.answerId,
            question.answers.rural.answerId
          ],
          otherDetail: ''
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUSLY_REPORTED)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.burning.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.rural.answerId
      }])
    })
    it('Happy accepts other and adds otherdetails to answer and forwards to SMELL_PREVIOUSLY_REPORTED', async () => {
      const options = {
        url,
        payload: {
          smellDescription: [
            question.answers.sewage.answerId,
            question.answers.burning.answerId,
            question.answers.other.answerId
          ],
          otherDetail: 'other details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUSLY_REPORTED)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.burning.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.other.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.otherDetail.answerId,
        otherDetails: 'other details'
      }])
    })
    it('Happy accepts no answer and defaults to You cannot describe it and forwards to SMELL_PREVIOUSLY_REPORTED', async () => {
      const options = {
        url,
        payload: {
          smellDescription: [],
          otherDetail: ''
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUSLY_REPORTED)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.youCannotDescribeIt.answerId
      }])
    })
  })
})
