import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_WATER_FEATURE
const header = 'In what kind of water is the pollution?'
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_WATER_FEATURE
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
    it('Happy: accepts valid answerId of sea or lake/reservoir and redirects to pollution-location', async () => {
      const answerId = question.answers.sea.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of not sea/lake/reservoir and redirects to pollution-location', async () => {
      const answerId = question.answers.river.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of something else with further details ', async () => {
      const answerId = question.answers.somethingElse.answerId
      const otherSource = 'test other details'
      const options = {
        url,
        payload: {
          answerId,
          otherSource
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetails.answerId,
        otherDetails: otherSource
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select a type of watercourse or feature, or you do not know')
    })
  })
})
