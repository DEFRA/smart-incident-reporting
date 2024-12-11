import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  home: {
    reporterEmailAddress: 'test@test.com'
  }
}

const sessionDataWithAnswer = {
  home: {
    reporterEmailAddress: 'test@test.com'
  },
  'water-pollution/images-or-video': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yes.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
    })
    it(`Should return success response and correct view for ${url} with pre entered data`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the pollution?', constants.statusCodes.OK, sessionDataWithAnswer)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
      expect(response.payload).toContain('value="2801" checked')
    })
  })
  describe('POST', () => {
    it('Should accept yes option and redirect to WATER_POLLUTION_LESS_THAN_10_METRES if flowing water feature', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'water-pollution/water-feature': [{
          questionId: 500,
          answerId: 501 // A River
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept no option and  redirects to WATER_POLLUTION_LESS_THAN_100_SQ_METRES if static water feature', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'water-pollution/water-feature': [{
          questionId: 500,
          answerId: 503 // The sea
        }]
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept yes option and redirect to WATER_POLLUTION_CHECK_YOUR_ANSWERS if flowing water feature if set in referer', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'water-pollution/water-feature': [{
          questionId: 500,
          answerId: 501 // A River
        }],
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept no option and  redirects to WATER_POLLUTION_CHECK_YOUR_ANSWERS if static water feature if set in referer', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        'water-pollution/water-feature': [{
          questionId: 500,
          answerId: 503 // The sea
        }],
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)).toEqual([{
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
      expect(response.payload).toContain('Select yes if you want to send us any images or videos')
    })
  })
})
