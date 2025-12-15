import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_FLOOD_RISK
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_FLOOD_RISK
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/flood-risk': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yes.answerId
  }]
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
    it(`Should pre-select saved answer from session for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="152" checked>')
    })
  })
  describe('POST', () => {    
    it.each([
      { answer: 'alreadyFlooding', description: 'already flooding', redirectTo: constants.routes.BLOCKAGE_FLOOD_RISK_DANGER },
      { answer: 'yes', description: 'yes', redirectTo: constants.routes.BLOCKAGE_FLOOD_RISK_DANGER },
      { answer: 'no', description: 'no', redirectTo: constants.routes.BLOCKAGE_OWNER },
      { answer: 'youDoNotKnow', description: 'you dont know', redirectTo: constants.routes.BLOCKAGE_OWNER }
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
      { answer: 'alreadyFlooding', description: 'already flooding' },
      { answer: 'yes', description: 'yes' },
      { answer: 'no', description: 'no' },
      { answer: 'youDoNotKnow', description: 'you dont know' }
    ])('Should save $description answer to session', async ({ answer }) => {
      const answerId = question.answers[answer].answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_FLOOD_RISK)).toEqual([{
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
      expect(response.payload).toContain('Select whether the blockage will cause a flood or &#39;you do not know&#39;')
    })
  })
})
