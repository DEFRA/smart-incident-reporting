import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_POLLUTION_AREA
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_AREA
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, question.text)
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answer and redirects to other information', async () => {
      const answerId = question.answers.under500sqm.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: error response to no option being selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select your estimated area, or that you do not know')
    })
  })
})
