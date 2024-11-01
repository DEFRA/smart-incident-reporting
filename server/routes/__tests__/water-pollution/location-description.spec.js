import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_LOCATION_DESCRIPTION
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LOCATION_DESCRIPTION
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const sessionData = {
  'water-pollution/location-description': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.locationDetails.answerId,
    otherDetails: 'test details'
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it.only(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('test details</textarea>')
    })
  })

  describe('POST', () => {
    it('Happy: accept and store a location description', async () => {
      const locationDescription = 'This is a description of the location of the water pollution'
      const options = {
        url,
        payload: {
          locationDescription
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_WHEN)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        otherDetails: locationDescription
      }])
    })
    it('Happy: accept and store a location description and redirect to referrer', async () => {
      const locationDescription = 'This is a description of the location of the water pollution'
      const options = {
        url,
        payload: {
          locationDescription
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION)).toEqual([{
        ...baseAnswer,
        otherDetails: locationDescription
      }])
    })
    it('Sad: errors on no locationDescription provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a description of where the pollution is')
    })
  })
})
