import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.VERMIN_TYPE
const question = questionSets.REPORT_REGULATED_SITE.questions.VERMIN_TYPE
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })

  describe('POST', () => {
    it('Should return error when no selection made', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select what type of vermin or pest is causing a problem')
    })

    it('Should return error when something else selected but no details provided', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.somethingElse.answerId.toString(),
          somethingElseDetail: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Type of vermin or pest')
      expect(response.payload).toContain(`value="${question.answers.somethingElse.answerId}" checked`)
    })

    it.each([
      {
        description: 'rats',
        payload: {
          answerId: question.answers.rats.answerId.toString()
        },
        expectedSelectedType: question.answers.rats.text.toLowerCase(),
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.rats.answerId }
        ]
      },
      {
        description: 'seagulls',
        payload: {
          answerId: question.answers.seagulls.answerId.toString()
        },
        expectedSelectedType: question.answers.seagulls.text.toLowerCase(),
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.seagulls.answerId }
        ]
      },
      {
        description: 'something else with details',
        payload: {
          answerId: question.answers.somethingElse.answerId.toString(),
          somethingElseDetail: 'Pigeons'
        },
        expectedSelectedType: 'vermin/pests',
        expectedAnswers: [
          { ...baseAnswer, answerId: question.answers.somethingElse.answerId },
          { ...baseAnswer, answerId: question.answers.somethingElseDetail.answerId, otherDetails: 'Pigeons' }
        ]
      }
    ])('Should accept valid answer and redirect when $description', async ({ payload, expectedAnswers, expectedSelectedType }) => {
      const options = {
        url,
        payload
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.VERMIN_SOURCE)
      expect(response.request.yar.get(question.key)).toEqual(expectedAnswers)
      expect(response.request.yar.get(constants.redisKeys.VERMIN_TYPE_SELECTED)).toEqual(expectedSelectedType)
    })
  })
})
