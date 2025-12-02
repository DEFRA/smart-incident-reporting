import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_HISTORY
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_HISTORY
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/history': [{
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
    it(`Should return success response and correct view for ${url}`, async () => {     
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('value="121" checked')
      expect(response.payload).toContain('test details')
    })
  })
  describe('POST', () => {
    it('Happy: accepts Yes and yes details and redirects to blockage/start', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: 'test details'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'blockage/history': [{
          questionId: 120,
          answerId: 121 //yes
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_HISTORY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yesDetails.answerId,
        otherDetails: 'test details'
      }])
    })
    it('Happy accepts No and forwards to blockage start', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.no.answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'blockage/history': [{
          questionId: 120,
          answerId: 122 // no
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_HISTORY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.no.answerId
      }])
    })
    it('Happy accepts you dont know and forwards to blockage start', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.youDoNotKnow.answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'blockage/history': [{
          questionId: 120,
          answerId: 123 // you dont know
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_HISTORY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.youDoNotKnow.answerId
      }])
    })
    it('Sad rejects empty payload', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select whether the blockage has been here for some time or \‘you do not know\’')
    })
    it('Sad rejects yes answer with no further details', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter details about how long the blockage has been here')
    })
  })
})
