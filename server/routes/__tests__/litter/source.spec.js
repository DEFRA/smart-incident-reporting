import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.LITTER_SOURCE
const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE
const header = 'Where is the litter coming from?'
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answerId of a waste site', async () => {
      const answerId = question.answers.wasteSite.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE)).toEqual([{ ...baseAnswer, answerId }])
    })
    it('Happy: accepts valid answerId of a large industrial site, factory or business', async () => {
      const answerId = question.answers.industry.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE)).toEqual([{ ...baseAnswer, answerId }])
    })
    it('Happy: accepts valid answerId of a sewage or water treatment works', async () => {
      const answerId = question.answers.sewage.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE)).toEqual([{ ...baseAnswer, answerId }])
    })
    it('Happy: accepts valid answerId of a farm or farming activity', async () => {
      const answerId = question.answers.farm.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE)).toEqual([{ ...baseAnswer, answerId }])
    })
    it('Happy: accepts valid answerId of a small local business', async () => {
      const answerId = question.answers.local.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE)).toEqual([{ ...baseAnswer, answerId }])
    })
    it('Happy: accepts valid answerId of a neighbouring property', async () => {
      const answerId = question.answers.neighbour.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE)).toEqual([{ ...baseAnswer, answerId }])
    })
    it('Happy: accepts valid answerId of unknown', async () => {
      const answerId = question.answers.unknown.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.RARS_SOURCE)).toEqual([{ ...baseAnswer, answerId }])
    })
    it('Sad: no radio selected, returns error state', async () => {
      const options = { url, payload: {} }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select a type of place or activity where the litter is coming from')
    })
  })
})
