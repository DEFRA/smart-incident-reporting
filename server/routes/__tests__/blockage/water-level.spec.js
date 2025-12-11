import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_WATER_LEVEL
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_WATER_LEVEL
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'blockage/water-level': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.yes.answerId
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, question.text)
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="141" checked>')
    })
  })
  describe('POST', () => {
    it('Should accept YES option and redirect to next page', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_FLOOD_RISK)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_WATER_LEVEL)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept NO and redirect to next page', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_FLOOD_RISK)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_WATER_LEVEL)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Should accept you dont know and redirect to next page', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_FLOOD_RISK)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_WATER_LEVEL)).toEqual([{
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
      expect(response.payload).toContain('Select ‘yes’ if water is building up behind the blockage')
    })
  })
})
