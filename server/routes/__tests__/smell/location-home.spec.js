import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_LOCATION_HOME
const question = questionSets.SMELL.questions.SMELL_LOCATION_HOME
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Is the smell affecting you at home?')
    })
  })
  describe('POST', () => {
    it('Should accept yes option and redirect to smell/location-address', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_FIND_ADDRESS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_HOME)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept no option and redirect to smell/location-options', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_HOME)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if the smell is affecting you at home')
    })
  })
})
