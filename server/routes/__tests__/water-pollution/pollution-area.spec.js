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
    it(`Should return success response and correct view when 100 to 500 metres is selected for ${url}`, async () => {
      const sessionData = {
        'water-pollution/pollution-area': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.over500sqm.answerId
        }]
      }
      const response = await submitGetRequest({ url }, 'How large an area does the pollution cover?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="302" checked>')
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
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
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
    it('Happy: For CYA journey, accepts valid answer and redirects to check-your-answers', async () => {
      const answerId = question.answers.under500sqm.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
  })
})
