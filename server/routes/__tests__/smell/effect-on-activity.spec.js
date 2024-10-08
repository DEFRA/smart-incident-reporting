import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_EFFECT_ON_ACTIVITY
const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_ACTIVITY
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
    it('Happy accepts any combination of answer and forwards to SMELL_EFFECT_ON_DAILY_LIFE', async () => {
      const options = {
        url,
        payload: {
          effect: [
            question.answers.goingOutside.answerId,
            question.answers.leavingHome.answerId
          ],
          otherDetail: ''
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.goingOutside.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.leavingHome.answerId
      }])
    })
    it('Happy accepts goingElsewhere and adds otherdetails to answer and forwards to SMELL_EFFECT_ON_DAILY_LIFE', async () => {
      const options = {
        url,
        payload: {
          effect: [
            question.answers.goingOutside.answerId,
            question.answers.leavingHome.answerId,
            question.answers.goingElsewhere.answerId
          ],
          otherDetails: 'other details'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.goingOutside.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.leavingHome.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.goingElsewhere.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.otherDetails.answerId,
        otherDetails: 'other details'
      }])
    })
    it('Happy no answers and default to none of these and forwards to SMELL_EFFECT_ON_DAILY_LIFE', async () => {
      const options = {
        url,
        payload: {
          otherDetail: ''
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_ACTIVITY)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.noImpact.answerId
      }])
    })
  })
})
