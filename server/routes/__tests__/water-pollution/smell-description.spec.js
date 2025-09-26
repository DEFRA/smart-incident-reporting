import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_SMELL_DESCRIPTION
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_SMELL_DESCRIPTION
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'water-pollution/smell-description': [{
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
      expect(response.payload).toContain('value="1026" checked')
      expect(response.payload).toContain('test details</textarea>')
    })
  })

  describe('POST', () => {
    it('Happy: accepts Yes and yes details and redirects to WATER_POLLUTION_SOURCE if flowing water feature', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: 'Further details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_SOURCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_SMELL_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yesDetails.answerId,
        otherDetails: 'Further details'
      }])
    })
    it('Sad rejects empty payload', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select &#39;yes&#39; if there is a smell')
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
      expect(response.payload).toContain('Enter a description of the smell')
    })
  })
})
