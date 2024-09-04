import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_SOURCE
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_SOURCE
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
    it('Happy accepts Yes and yes Details and forwards to WATER_POLLUTION_IMAGES_OR_VIDEO', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId,
          yesDetails: 'Further details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yesDetails.answerId,
        otherDetails: 'Further details'
      }])
    })
    it('Happy accepts No and forwards to WATER_POLLUTION_IMAGES_OR_VIDEO', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.no.answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.no.answerId
      }])
    })
    it('Sad rejects empty payload', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Answer yes if you know where the pollution is coming from')
    })
    it('Sad rejects yes answer with no further details', async () => {
      const options = {
        url,
        payload: {
          answerId: question.answers.yes.answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter details about where the pollution is coming from')
    })
  })
})
