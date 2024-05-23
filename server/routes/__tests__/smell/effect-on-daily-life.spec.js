import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_EFFECT_ON_DAILY_LIFE
const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_DAILY_LIFE
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const sessionData = {
        'smell/ongoing': [{
          questionId: questionSets.SMELL.questions.SMELL_ONGOING.questionId,
          answerId: questionSets.SMELL.questions.SMELL_ONGOING.answers.yes.answerId
        }]
      }
      await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url}`, async () => {
      const sessionData = {
        'smell/ongoing': [{
          questionId: questionSets.SMELL.questions.SMELL_ONGOING.questionId,
          answerId: questionSets.SMELL.questions.SMELL_ONGOING.answers.no.answerId
        }]
      }
      await submitGetRequest({ url }, header.replace('?', ', on this occasion?'), constants.statusCodes.OK, sessionData)
    })
  })

  describe('POST', () => {
    // Happy:
    it('Happy accepts any combination of answer and forwards to SMELL_EFFECT_ON_HEALTH', async () => {
      const options = {
        url,
        payload: {
          effect: [
            question.answers.cover.answerId,
            question.answers.clothes.answerId
          ],
          otherDetail: ''
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.cover.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.clothes.answerId
      }])
    })
    it('Happy accepts other and adds otherdetails to answer and forwards to SMELL_EFFECT_ON_HEALTH', async () => {
      const options = {
        url,
        payload: {
          effect: [
            question.answers.cover.answerId,
            question.answers.clothes.answerId,
            question.answers.other.answerId
          ],
          otherDetails: 'other details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.cover.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.clothes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.other.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.otherDetails.answerId,
        otherDetails: 'other details'
      }])
    })
    it('Happy no answers and default to none of these and forwards to SMELL_EFFECT_ON_HEALTH', async () => {
      const options = {
        url,
        payload: {
          otherDetail: ''
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.noActions.answerId
      }])
    })
  })
})
