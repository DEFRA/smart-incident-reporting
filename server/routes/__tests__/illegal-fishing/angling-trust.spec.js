import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ILLEGAL_FISHING_ANGLING_TRUST
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ANGLING_TRUST
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, question.text)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })

  describe('POST', () => {
    it('Happy: accepts yes and redirects to illegal-fishing/images-or-video', async () => {
      const answerId = question.answers.yes.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_IMAGES_OR_VIDEO)
    })

    it('Happy: accepts yes and stores answer in session', async () => {
      const answerId = question.answers.yes.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ANGLING_TRUST)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })

    it('Happy: accepts no and redirects to illegal-fishing/images-or-video', async () => {
      const answerId = question.answers.no.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.ILLEGAL_FISHING_IMAGES_OR_VIDEO)
    })

    it('Happy: accepts no and stores answer in session', async () => {
      const answerId = question.answers.no.answerId
      const options = { url, payload: { answerId } }
      const response = await submitPostRequest(options)
      expect(response.request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ANGLING_TRUST)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })

    it('Sad: no radio selected, returns error banner', async () => {
      const options = { url, payload: {} }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
    })

    it('Sad: no radio selected, returns validation message', async () => {
      const options = { url, payload: {} }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('Select &#39;yes&#39; if you are an Angling Trust volunteer')
    })
  })
})
