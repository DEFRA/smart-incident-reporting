import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_SMELL_STRENGTH
const question = questionSets.REPORT_REGULATED_SITE.questions.SMELL_SMELL_STRENGTH

describe(url, () => {
  describe('GET', () => {
    it('Should return success response and the past tense question by default', async () => {
      const response = await submitGetRequest({ url }, 'How strong was the smell')
      expect(response.payload).toContain('How strong was the smell?')
      expect(response.payload).toContain(question.answers.veryWeak.text)
      expect(response.payload).toContain(question.answers.extremelyStrong.text)
    })

    it('Should return the present tense question when the smell is happening now', async () => {
      const sessionData = {
        'date-time-option': 1
      }
      const response = await submitGetRequest({ url }, 'How strong is the smell', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('How strong is the smell?')
    })
  })

  describe('POST', () => {
    it('Should return an error when the answer is missing', async () => {
      const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK)
      expect(response.payload).toContain('Select how strong the smell was')
      expect(response.payload).toContain('href="#answerId"')
    })

    it('Should return a present tense error when the smell is happening now', async () => {
      const sessionData = {
        'date-time-option': 1
      }
      const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Select how strong the smell is')
    })

    it('Should store the answer and redirect to the indoors page', async () => {
      const answerId = question.answers.distinct.answerId
      const response = await submitPostRequest({ url, payload: { answerId: answerId.toString() } })
      expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
      expect(response.headers.location).toBe(constants.routes.SMELL_INDOORS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SMELL_STRENGTH)).toEqual([{
        questionId: question.questionId,
        questionAsked: question.text,
        questionResponse: true,
        answerId
      }])
    })
  })
})
