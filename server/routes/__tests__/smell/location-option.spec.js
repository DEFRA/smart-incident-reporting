import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_LOCATION_OPTION
const question = questionSets.SMELL.questions.SMELL_LOCATION_OPTION
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Where can you notice the smell?')
    })
  })
  describe('POST', () => {
    // Happy accepts address and redirects to address
    it('Should accept address option and redirect to smell/location-address', async () => {
      const answerId = question.answers.address.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_LOCATION_ADDRESS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })

    // Happy accepts description and redirects to description
    it('Should accept description option and redirect to smell/location-description', async () => {
      const answerId = question.answers.description.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    // Sad no option selected, shows error message
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how you&#39;d prefer to give the location')
    })
  })
})