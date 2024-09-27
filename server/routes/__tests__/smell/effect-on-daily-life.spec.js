import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_EFFECT_ON_DAILY_LIFE
const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_DAILY_LIFE
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
    it('Happy: accepts valid single answerID (non array) and redirects to SMELL_EFFECT_ON_HEALTH', async () => {
      const answerId = question.answers.leave.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.leave.answerId
      }])
    })
    it('Happy: accepts valid array of answerID and redirects to SMELL_EFFECT_ON_HEALTH', async () => {
      const answerId = [question.answers.leave.answerId.toString(), question.answers.windows.answerId.toString(), question.answers.goingOutside.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.leave.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.windows.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.goingOutside.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with put off doing something and other details and redirects to SMELL_EFFECT_ON_HEALTH', async () => {
      const answerId = question.answers.goingElsewhere.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          putOffDetails: 'Put off doing something'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.goingElsewhere.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.putOffDetails.answerId,
        otherDetails: 'Put off doing something'
      }])
    })
    it('Happy: accepts valid array of answerID and other details and redirects to SMELL_EFFECT_ON_HEALTH', async () => {
      const answerId = [question.answers.goingElsewhere.answerId.toString(), question.answers.cancelEvent.answerId.toString(), question.answers.somethingElse.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId,
          putOffDetails: 'Put off doing something',
          eventDetails: 'Details of the event',
          somethingElseDetails: 'Details about what happened'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.goingElsewhere.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.cancelEvent.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.putOffDetails.answerId,
        otherDetails: 'Put off doing something'
      }, {
        ...baseAnswer,
        answerId: question.answers.eventDetails.answerId,
        otherDetails: 'Details of the event'
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetails.answerId,
        otherDetails: 'Details about what happened'
      }])
    })
    it('Happy: accepts empty answerId, defaults to none of these and redirects to SMELL_EFFECT_ON_HEALTH', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_EFFECT_ON_HEALTH)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.noImpact.answerId
      }])
    })
  })
})
