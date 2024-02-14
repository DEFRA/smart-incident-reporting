import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES
const question = constants.questions.WATER_POLLUTION_LESS_THAN_100_SQ_METRES
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'water-pollution/water-feature': [{
    questionId: 500,
    answerId: 503
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
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
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
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
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_AREA)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts do not know and redirects to other information', async () => {
      const answerId = question.answers.doNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)).toEqual([{
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
      expect(response.payload).toContain('Select yes if the pollution covers less than 100 square metres')
    })
  })
})
