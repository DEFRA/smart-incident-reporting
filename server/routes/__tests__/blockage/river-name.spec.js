import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_RIVER_NAME
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_RIVER_NAME
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/river-name': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yes.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.yesDetails.answerId,
    otherDetails: 'test details'
  }]
}

describe(url, () => {
  describe('GET', () => {
    it('Should return success response for GET request', async () => {
      const response = await submitGetRequest({ url }, header)
      expect(response.statusCode).toEqual(constants.statusCodes.OK)
      expect(response.payload).toContain(header)
    })
    it('Should pre-populate form when session data exists', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('value="106" checked')
      expect(response.payload).toContain('value="test details"')
    })
  })

  describe('POST', () => {
    it('Happy: accepts Yes and yes details and redirects to blockage/blockage-type', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: 'Further details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_TYPE)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_RIVER_NAME)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yesDetails.answerId,
        otherDetails: 'Further details'
      }])
    })
    it('Sad: rejects empty payload', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Answer &#39;yes&#39; if you know the name of the river')
    })
    it('Sad: rejects yes answer with no further details', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter the name of the river')
    })
    it('Happy: accepts No answer and redirects to blockage/blockage-type', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.no.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_TYPE)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_RIVER_NAME)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.no.answerId
      }])
    })
  })
})
