import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_IMAGES_OR_VIDEO
const question = questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  home: {
    reporterEmailAddress: 'test@test.com'
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Do you want to send us any images or videos of the problem?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('We\'ll send a message to <strong>test@test.com</strong> with details on where to send these, if needed.')
    })
  })
  describe('POST', () => {
    it('Should accept yes option and redirect to SMELL_OTHER_INFORMATION', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_OTHER_INFORMATION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_IMAGES_OR_VIDEO)).toEqual([{
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
      expect(response.payload).toContain('Select yes if you want to send us any images or videos')
    })
  })
})
