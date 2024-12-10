import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_APPEARANCE
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'water-pollution/pollution-appearance': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.cloudy.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.scum.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.somethingElse.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.somethingElseDetail.answerId,
    otherDetails: 'test details'
  }]
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, baseAnswer.questionAsked)
    })
    it(`Should return success response and correct view for ${url} with prior entered values`, async () => {
      const response = await submitGetRequest({ url }, baseAnswer.questionAsked, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId" name="answerId" type="checkbox" value="1002" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-3" name="answerId" type="checkbox" value="1003" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-4" name="answerId" type="checkbox" value="1004" checked')
      expect(response.payload).toContain('value="test details">')
    })
  })

  describe('POST', () => {
    it('Happy: accepts valid single answerID (non array) and redirects to WATER_POLLUTION_SOURCE', async () => {
      const answerId = question.answers.cloudy.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_SOURCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.cloudy.answerId
      }])
    })
    it('Happy: accepts valid answerIds and redirects to WATER_POLLUTION_SOURCE', async () => {
      const answerId = [
        question.answers.cloudy.answerId.toString(),
        question.answers.scum.answerId.toString()
      ]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_SOURCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: Number(answerId[0])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[1])
      }])
    })
    it('Happy: accepts valid answerId with something else details', async () => {
      const somethingElseDetail = 'Something else details'
      const answerId = [
        question.answers.cloudy.answerId.toString(),
        question.answers.scum.answerId.toString(),
        question.answers.somethingElse.answerId.toString()
      ]
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetail
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_SOURCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: Number(answerId[0])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[1])
      }, {
        ...baseAnswer,
        answerId: Number(answerId[2])
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetail.answerId,
        otherDetails: somethingElseDetail
      }])
    })
    it('Happy: Redirects to referer when set', async () => {
      const answerId = question.answers.cloudy.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.cloudy.answerId
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select what the pollution looks like')
    })
  })
})
