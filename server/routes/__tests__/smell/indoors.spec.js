import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_INDOORS
const question = questionSets.SMELL.questions.SMELL_INDOORS
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
      const wasHeader = header.replace('Is', 'Was')
      await submitGetRequest({ url }, wasHeader, constants.statusCodes.OK, sessionData)
    })
  })

  describe('POST', () => {
    it('Happy Yes and continues to SMELL_CLOTHING_AND_HAIR', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CLOTHING_AND_HAIR)
      expect(response.request.yar.get(constants.redisKeys.SMELL_INDOORS)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }])
    })
    it('Happy no and continues to SMELL_CLOTHING_AND_HAIR', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.no.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CLOTHING_AND_HAIR)
      expect(response.request.yar.get(constants.redisKeys.SMELL_INDOORS)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.no.answerId
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
      expect(response.payload).toContain('Select yes if the smell is noticeable indoors')
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
      expect(response.payload).toContain('Select yes if the smell was noticeable indoors')
    })
  })
})
