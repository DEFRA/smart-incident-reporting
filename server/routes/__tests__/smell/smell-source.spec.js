import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_SOURCE
const question = questionSets.SMELL.questions.SMELL_SOURCE
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const payload = {
  smellSource: 'yes',
  yesDetails: 'Further details'
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Happy accepts Yes and yes Details and forwards to SMELL_DESCRIPTION', async () => {
      const options = {
        url,
        payload: {
          smellSource: 'yes',
          yesDetails: 'Further details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yesDetails.answerId,
        otherDetails: payload.yesDetails
      }])
    })
    it('Happy accepts No and forwards to SMELL_DESCRIPTION', async () => {
      const options = {
        url,
        payload: {
          smellSource: 'no'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
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
      expect(response.payload).toContain('Select yes if you know where the smell is coming from')
    })
    it('Sad rejects yes with no further details', async () => {
      const options = {
        url,
        payload: {
          smellSource: 'yes',
          yesDetails: ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Give as many details about the source of the smell as you can, including an address if known.')
    })
  })
})
