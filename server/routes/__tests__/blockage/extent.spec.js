import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_EXTENT
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_EXTENT
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/extent': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.full.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, question.text)
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="131" checked>')
    })
  })
  describe('POST', () => {
    it('Should accept full option and redirect to blockage/start', async () => {
      const answerId = question.answers.full.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_EXTENT)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept more than half and redirect to blockage/start', async () => {
      const answerId = question.answers.moreThanHalf.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_EXTENT)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept less than half and redirect to blockage/start', async () => {
      const answerId = question.answers.lessThanHalf.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_EXTENT)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept you dont know and redirect to blockage/start', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_EXTENT)).toEqual([{
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
      expect(response.payload).toContain('Select how much of the river is blocked or ’you do not know’')
    })
  })
})
