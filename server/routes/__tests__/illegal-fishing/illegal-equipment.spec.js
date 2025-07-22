import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, baseAnswer.questionAsked)
    })
  })

  describe('POST', () => {
    it('Happy: accepts valid single answerID (non array) and redirects to illegal-fishing/type-of-fish', async () => {
      const answerId = question.answers.illegalRodOrTackle.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_TYPE_OF_FISH)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.illegalRodOrTackle.answerId
      }])
    })
    it('Happy: accepts valid array of answerID and redirects to illegal-fishing/type-of-fish', async () => {
      const answerId = [question.answers.netsOrTraps.answerId.toString(), question.answers.fixedLines.answerId.toString(), question.answers.electricStunDevices.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_TYPE_OF_FISH)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.netsOrTraps.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.fixedLines.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.electricStunDevices.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with something else and other details and redirects to illegal-fishing/type-of-fish', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetail: 'something else'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_TYPE_OF_FISH)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetail.answerId,
        otherDetails: 'something else'
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select what equipment is being used or &#39;you do not know&#39;')
    })
  })
})
