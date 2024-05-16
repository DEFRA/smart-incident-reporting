import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_EFFECT_ON_WILDLIFE
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const payload = {
  effectOnWildlife: 'yes',
  yesDetails: 'Further details'
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Happy accepts Yes and yes Details and forwards to WATER_POLLUTION_OTHER_INFORMATION', async () => {
      const options = {
        url,
        payload: {
          effectOnWildlife: 'yes',
          yesDetails: 'Further details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yesDetails.answerId,
        otherDetails: payload.yesDetails
      }])
    })
    it('Happy accepts Yes and empty yes details and forwards to WATER_POLLUTION_OTHER_INFORMATION', async () => {
      const options = {
        url,
        payload: {
          effectOnWildlife: 'yes'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }])
    })
    it('Happy accepts No and forwards to WATER_POLLUTION_OTHER_INFORMATION', async () => {
      const options = {
        url,
        payload: {
          effectOnWildlife: 'no'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE)).toEqual([{
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
      expect(response.payload).toContain('Select yes if you&#39;ve seen dead or distressed fish or other animals nearby')
    })
  })
})
