import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_POLLUTION_WIDTH
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_WIDTH
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
      await submitGetRequest({ url }, 'Is the pollution across the full width of the river?', constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url}: canal`, async () => {
      sessionData[constants.redisKeys.WATER_POLLUTION_WATER_FEATURE][0].answerId = 504
      await submitGetRequest({ url }, 'Is the pollution across the full width of the canal?', constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url}: watercourse`, async () => {
      sessionData[constants.redisKeys.WATER_POLLUTION_WATER_FEATURE][0].answerId = 505
      await submitGetRequest({ url }, 'Is the pollution across the full width of the watercourse?', constants.statusCodes.OK, sessionData)
    })
  })
  describe('POST', () => {
    it('Happy: accepts yes and redirects to other information', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, 302, sessionData)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_WIDTH)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts no and redirects to pollution-length', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, 302, sessionData)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_WIDTH)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts do not know and redirects to other information', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, 302, sessionData)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_WIDTH)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if there&#39;s pollution along both sides of the watercourse')
    })
  })
})
