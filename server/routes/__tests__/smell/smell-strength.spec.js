import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_STRENGTH
const question = questionSets.SMELL.questions.SMELL_STRENGTH
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
        'smell/ongoing': [{
          questionId: questionSets.SMELL.questions.SMELL_ONGOING.questionId,
          answerId: questionSets.SMELL.questions.SMELL_ONGOING.answers.yes.answerId
        }]
      }
      await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url} if past smell`, async () => {
      const sessionData = {
        'smell/ongoing': [{
          questionId: questionSets.SMELL.questions.SMELL_ONGOING.questionId,
          answerId: questionSets.SMELL.questions.SMELL_ONGOING.answers.no.answerId
        }]
      }
      const wasHeader = header.replace('is', 'was')
      await submitGetRequest({ url }, wasHeader, constants.statusCodes.OK, sessionData)
    })
  })

  describe('POST', () => {
    it('Happy Strong and continues to SMELL_EFFECT_ON_ACTIVITY', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.strong.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_ACTIVITY)
      expect(response.request.yar.get(constants.redisKeys.SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.strong.answerId
      }])
    }) 
    it('Happy persistent and continues to SMELL_EFFECT_ON_ACTIVITY', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.persistent.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_ACTIVITY)
      expect(response.request.yar.get(constants.redisKeys.SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.persistent.answerId
      }])
    })
    it('Happy faint and continues to SMELL_EFFECT_ON_ACTIVITY', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.faint.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_ACTIVITY)
      expect(response.request.yar.get(constants.redisKeys.SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.faint.answerId
      }])
    })
    it('Happy very faint and continues to SMELL_EFFECT_ON_ACTIVITY', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.veryFaint.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_ACTIVITY)
      expect(response.request.yar.get(constants.redisKeys.SMELL_STRENGTH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.veryFaint.answerId
      }])
    })
    it('Sad rejects empty payload with ongoing smell', async () => {
      const sessionData = {
        'smell/ongoing': [{
          questionId: questionSets.SMELL.questions.SMELL_ONGOING.questionId,
          answerId: questionSets.SMELL.questions.SMELL_ONGOING.answers.yes.answerId
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
        'smell/ongoing': [{
          questionId: questionSets.SMELL.questions.SMELL_ONGOING.questionId,
          answerId: questionSets.SMELL.questions.SMELL_ONGOING.answers.no.answerId
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
