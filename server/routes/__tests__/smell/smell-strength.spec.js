import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_SMELL_STRENGTH
const question = questionSets.SMELL.questions.SMELL_SMELL_STRENGTH
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url} if current smell`, async () => {
      const sessionData = {
        'smell/current': [{
          questionId: questionSets.SMELL.questions.SMELL_CURRENT.questionId,
          answerId: questionSets.SMELL.questions.SMELL_CURRENT.answers.yes.answerId
        }]
      }
      await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url} if past smell`, async () => {
      const sessionData = {
        'smell/current': [{
          questionId: questionSets.SMELL.questions.SMELL_CURRENT.questionId,
          answerId: questionSets.SMELL.questions.SMELL_CURRENT.answers.no.answerId
        }]
      }
      const wasHeader = header.replace('is', 'was')
      await submitGetRequest({ url }, wasHeader, constants.statusCodes.OK, sessionData)
    })
  })

  describe('POST', () => {
    it('Happy Faint and continues to SMELL_INDOORS', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.faint.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_INDOORS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.faint.answerId
      }])
    })
    it('Happy distinct and continues to SMELL_INDOORS', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.distinct.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_INDOORS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.distinct.answerId
      }])
    })
    it('Happy strong and continues to SMELL_INDOORS', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.strong.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_INDOORS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.strong.answerId
      }])
    })
    it('Happy very strong and continues to SMELL_INDOORS', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.veryStrong.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_INDOORS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.veryStrong.answerId
      }])
    })
    it('Sad rejects empty payload with current smell', async () => {
      const sessionData = {
        'smell/current': [{
          questionId: questionSets.SMELL.questions.SMELL_CURRENT.questionId,
          answerId: questionSets.SMELL.questions.SMELL_CURRENT.answers.yes.answerId
        }]
      }
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how strong the smell is')
    })
    it('Sad rejects empty payload with past smell', async () => {
      const sessionData = {
        'smell/current': [{
          questionId: questionSets.SMELL.questions.SMELL_CURRENT.questionId,
          answerId: questionSets.SMELL.questions.SMELL_CURRENT.answers.no.answerId
        }]
      }
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how strong the smell was')
    })
  })
})
