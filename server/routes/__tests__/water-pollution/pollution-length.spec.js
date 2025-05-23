import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_POLLUTION_LENGTH
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_LENGTH
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'water-pollution/water-feature': [{
    questionId: 500,
    answerId: 501
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}: river`, async () => {
      await submitGetRequest({ url }, 'How far along the river does the pollution spread?', constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url}: canal`, async () => {
      sessionData[constants.redisKeys.WATER_POLLUTION_WATER_FEATURE][0].answerId = 504
      await submitGetRequest({ url }, 'How far along the canal does the pollution spread?', constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url}: watercourse`, async () => {
      sessionData[constants.redisKeys.WATER_POLLUTION_WATER_FEATURE][0].answerId = 505
      await submitGetRequest({ url }, 'How far along the watercourse does the pollution spread?', constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view when 100 to 500 metres is selected for ${url}`, async () => {
      let sessionData = {
        'water-pollution/pollution-length': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.stretches100to500m.answerId
        }]
      }
      const answerData = {
        'water-pollution/water-feature': [{
          questionId: 500,
          questionAsked: 'In what kind of water is the pollution?',
          questionResponse: true,
          answerId: 501
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, 'How far along the river does the pollution spread?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="402" checked>')
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answer and redirects to width', async () => {
      const answerId = question.answers.stretches10to100m.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: error response to no option being selected', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select your estimated length, or that you do not know')
    })
    it('Happy: For CYA journey, accepts valid answer and redirects to check-your-answers', async () => {
      const answerId = question.answers.stretches10to100m.answerId
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
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
  })
})
