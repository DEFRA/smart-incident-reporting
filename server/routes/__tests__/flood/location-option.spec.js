import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.FLOOD_LOCATION_OPTION
const question = questionSets.FLOOD.questions.FLOOD_LOCATION_OPTION
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it('renders the location option question', async () => {
      await submitGetRequest({ url }, question.text)
    })

    it('renders a previously selected answer', async () => {
      const answerId = question.answers.description.answerId
      const sessionData = {
        [constants.redisKeys.FLOOD_LOCATION_OPTION]: [{ questionId: question.questionId, answerId }]
      }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)

      expect(response.payload).toContain(`value="${answerId}" checked`)
    })
  })

  describe('POST', () => {
    it.each([
      ['GPS', question.answers.gps.answerId, constants.routes.FLOOD_LOCATION_MAP],
      ['map', question.answers.map.answerId, constants.routes.FLOOD_LOCATION_MAP],
      ['description', question.answers.description.answerId, constants.routes.FLOOD_LOCATION_DESCRIPTION]
    ])('accepts the %s option and stores the answer', async (_option, answerId, redirect) => {
      const response = await submitPostRequest({
        url,
        payload: { answerId: String(answerId) }
      })

      expect(response.headers.location).toBe(redirect)
      expect(response.request.yar.get(constants.redisKeys.FLOOD_LOCATION_OPTION)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })

    it('returns an error when no option is selected', async () => {
      const response = await submitPostRequest(
        { url, payload: {} },
        constants.statusCodes.OK
      )

      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select how you want to give the location')
    })
  })
})
