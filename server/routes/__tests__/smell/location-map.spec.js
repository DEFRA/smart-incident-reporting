import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_LOCATION_MAP
const question = questionSets.SMELL.questions.SMELL_LOCATION_MAP
const header = question.text
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
    it('Happy: accept and store a point as a national grid reference', async () => {
      const point = '[365739.764, 343015.986]'
      const options = {
        url,
        payload: {
          point
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_MAP)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.nationalGridReference.answerId,
        otherDetails: 'SJ 65739 43015'
      }, {
        ...baseAnswer,
        answerId: question.answers.easting.answerId,
        otherDetails: '365739'
      }, {
        ...baseAnswer,
        answerId: question.answers.northing.answerId,
        otherDetails: '343015'
      }, {
        ...baseAnswer,
        answerId: question.answers.lng.answerId,
        otherDetails: '-2.511745'
      }, {
        ...baseAnswer,
        answerId: question.answers.lat.answerId,
        otherDetails: '52.983397'
      }])
    })
    it('Sad: errors on no point provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Mark a location by clicking or tapping the map')
    })
  })
})
