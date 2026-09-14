import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_INDOORS
const question = questionSets.REPORT_REGULATED_SITE.questions.SMELL_INDOORS

describe(url, () => {
  describe('GET', () => {
    it('Should return success response and the past tense question by default', async () => {
      const response = await submitGetRequest({ url }, 'Was the smell noticeable indoors')
      expect(response.payload).toContain('Was the smell noticeable indoors?')
      expect(response.payload).toContain(question.answers.yes.text)
      expect(response.payload).toContain(question.answers.no.text)
    })

    it('Should return the present tense question when the smell is happening now', async () => {
      const sessionData = {
        'date-time-option': 1
      }
      const response = await submitGetRequest({ url }, 'Is the smell noticeable indoors', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Is the smell noticeable indoors?')
    })
  })

  describe('POST', () => {
    it('Should return an error when the answer is missing', async () => {
      const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK)
      expect(response.payload).toContain('Select &#39;yes&#39; if the smell was noticeable indoors')
      expect(response.payload).toContain('href="#answerId"')
    })

    it('Should return a present tense error when the smell is happening now', async () => {
      const sessionData = {
        'date-time-option': 1
      }
      const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Select &#39;yes&#39; if the smell is noticeable indoors')
    })

    it('Should store the answer and redirect to the clothing and hair page', async () => {
      const answerId = question.answers.yes.answerId
      const response = await submitPostRequest({ url, payload: { answerId: answerId.toString() } })
      expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
      expect(response.headers.location).toBe(constants.routes.SMELL_CLOTHING_AND_HAIR)
      expect(response.request.yar.get(constants.redisKeys.SMELL_INDOORS)).toEqual([{
        questionId: question.questionId,
        questionAsked: question.text,
        questionResponse: true,
        answerId
      }])
    })
  })
})
