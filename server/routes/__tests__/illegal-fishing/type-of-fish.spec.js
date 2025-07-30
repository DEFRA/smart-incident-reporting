import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.ILLEGAL_FISHING_TYPE_OF_FISH
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_TYPE_OF_FISH
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
    it('Happy: accepts valid single answerID (non array) and redirects to illegal-fishing/fish-taken', async () => {
      const answerId = question.answers.salmon.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_FISH_TAKEN)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_TYPE_OF_FISH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.salmon.answerId
      }])
    })
    it('Happy: accepts valid array of answerID and redirects to illegal-fishing/fish-taken', async () => {
      const answerId = [question.answers.lampreyOrEel.answerId.toString(), question.answers.seaTrout.answerId.toString(), question.answers.crayfish.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_FISH_TAKEN)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_TYPE_OF_FISH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.lampreyOrEel.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.seaTrout.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.crayfish.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with other fish and other fish details and redirects to illegal-fishing/fish-taken', async () => {
      const answerId = question.answers.otherFish.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          otherFishDetail: 'Other fish details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_FISH_TAKEN)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_TYPE_OF_FISH)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.otherFish.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.otherFishDetail.answerId,
        otherDetails: 'Other fish details'
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select the type of fish or &#39;you do not know&#39;')
    })
  })
})
