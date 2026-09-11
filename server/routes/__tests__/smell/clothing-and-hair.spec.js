import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_CLOTHING_AND_HAIR
const question = questionSets.REPORT_REGULATED_SITE.questions.SMELL_CLOTHING_AND_HAIR

describe(url, () => {
  describe('GET', () => {
    it('Should return success response and the past tense question by default', async () => {
      const response = await submitGetRequest({ url }, 'Did the smell stick to your clothing or hair')
      expect(response.payload).toContain('Did the smell stick to your clothing or hair?')
      expect(response.payload).toContain(question.answers.yes.text)
      expect(response.payload).toContain(question.answers.no.text)
    })

    it('Should return the present tense question when the smell is happening now', async () => {
      const sessionData = {
        'date-time-option': 1
      }
      const response = await submitGetRequest({ url }, 'Does the smell stick to your clothing or hair', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Does the smell stick to your clothing or hair?')
    })
  })

  describe('POST', () => {
    it('Should return an error when the answer is missing', async () => {
      const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK)
      expect(response.payload).toContain('Select &#39;yes&#39; if the smell stuck to your clothing or hair')
      expect(response.payload).toContain('href="#answerId"')
    })

    it('Should return a present tense error when the smell is happening now', async () => {
      const sessionData = {
        'date-time-option': 1
      }
      const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Select &#39;yes&#39; if the smell sticks to your clothing or hair')
    })

    it('Should store the answer and redirect to the effect on daily life page', async () => {
      const answerId = question.answers.no.answerId
      const response = await submitPostRequest({ url, payload: { answerId: answerId.toString() } })
      expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
      expect(response.headers.location).toBe(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_CLOTHING_AND_HAIR)).toEqual([{
        questionId: question.questionId,
        questionAsked: question.text,
        questionResponse: true,
        answerId
      }])
    })
  })
})
