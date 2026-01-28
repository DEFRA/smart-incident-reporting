import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LESS_THAN_10_METRES
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
      await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url}: canal`, async () => {
      sessionData[constants.redisKeys.WATER_POLLUTION_WATER_FEATURE][0].answerId = 504
      await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url}: watercourse`, async () => {
      sessionData[constants.redisKeys.WATER_POLLUTION_WATER_FEATURE][0].answerId = 505
      await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view when more is selected for ${url}`, async () => {
      let sessionData = {
        'water-pollution/less-than-10-metres': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.more.answerId
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
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="704" checked>')
    })
    it(`Should return success response and correct view when less is selected for ${url}`, async () => {
      let sessionData = {
        'water-pollution/less-than-10-metres': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.less.answerId
        }]
      }
      const answerData = {
        'water-pollution/water-feature': [{
          questionId: 500,
          questionAsked: 'In what kind of water is the pollution?',
          questionResponse: true,
          answerId: 504
        }]
      }
      sessionData = { ...sessionData, ...answerData }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="705" checked>')
    })
  })
  describe('POST', () => {
    it('Happy: accepts less and redirects to other information', async () => {
      const answerId = question.answers.less.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts more and redirects to pollution-length', async () => {
      const answerId = question.answers.more.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_LENGTH)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES)).toEqual([{
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
      expect(response.payload).toContain('Select how much pollution you have seen')
    })
    it('Happy: For CYA journey, accepts valid answerID for more and redirects to pollution-length', async () => {
      const answerId = question.answers.more.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_LENGTH)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: For CYA journey, accepts valid answerID for less and redirects to check-your-answers', async () => {
      const answerId = question.answers.less.answerId
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
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)).toEqual(null)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
  })
})
