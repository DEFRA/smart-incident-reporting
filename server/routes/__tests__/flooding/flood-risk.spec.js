import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FLOOD_RISK
const question = questionSets.FLOODING.questions.FLOOD_RISK
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
    it(`Should display correct question text for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text)
      expect(response.payload).toContain(question.text)
    })
    it.each([
      { answer: 'now', id: 'answerId' },
      { answer: 'soon', id: 'answerId-2' },
      { answer: 'recent', id: 'answerId-3' },
      { answer: 'iDontKnow', id: 'answerId-4' }
    ])(`Should pre-select saved $answer answer from session for ${url}`, async ({ answer, id }) => {
      const answerId = question.answers[answer].answerId
      const sessionData = {
        [question.key]: [{
          questionId: baseAnswer.questionId,
          answerId
        }]
      }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain(`<input class="govuk-radios__input" id="${id}" name="answerId" type="radio" value="${answerId}" checked>`)
    })
  })
  describe('POST', () => {
    it.each([
      { answer: 'now', description: 'flooding happening now', redirectTo: constants.routes.FLOOD_SOURCE },
      { answer: 'soon', description: 'flooding that may happen soon', redirectTo: constants.routes.FLOOD_SOURCE },
      { answer: 'recent', description: 'a recent flood', redirectTo: constants.routes.FLOOD_SOURCE },
      { answer: 'iDontKnow', description: 'not knowing', redirectTo: constants.routes.FLOOD_SOURCE }
    ])('Should redirect to $redirectTo when $description selected', async ({ answer, redirectTo }) => {
      const answerId = question.answers[answer].answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(redirectTo)
    })
    it.each([
      { answer: 'now', description: 'flooding happening now' },
      { answer: 'soon', description: 'flooding that may happen soon' },
      { answer: 'recent', description: 'a recent flood' },
      { answer: 'iDontKnow', description: 'not knowing' }
    ])('Should save $description answer to session', async ({ answer }) => {
      const answerId = question.answers[answer].answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.FLOOD_RISK)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should return error when no radio selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
    })
    it('Should display correct error message when no radio selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('Select what you would like to report')
    })
  })
})
