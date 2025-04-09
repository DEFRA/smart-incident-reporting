import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.WATER_POLLUTION_POLLUTION_SUBSTANCE
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_SUBSTANCE
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const sessionData = {
  'water-pollution/pollution-substance': [{
    questionId: baseAnswer.questionId,
    answerId: question.answers.sewage.answerId
  }, {
    questionId: baseAnswer.questionId,
    answerId: question.answers.chemical.answerId
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
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId" name="answerId" type="checkbox" value="2901" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-2" name="answerId" type="checkbox" value="2902" checked>')
      expect(response.payload).toContain('<input class="govuk-checkboxes__input" id="answerId-5" name="answerId" type="checkbox" value="2905" checked')
      expect(response.payload).toContain('value="test details">')
    })
  })

  describe('POST', () => {
    it('Happy: accepts valid single answerID (non array) and redirects to WATER_POLLUTION_POLLUTION_APPEARANCE', async () => {
      const answerId = question.answers.sewage.answerId.toString()
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }])
    })
    it('Happy: accepts valid array of answerID and redirects to WATER_POLLUTION_POLLUTION_APPEARANCE', async () => {
      const answerId = [question.answers.sewage.answerId.toString(), question.answers.chemical.answerId.toString(), question.answers.rural.answerId.toString()]
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.chemical.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.rural.answerId
      }
      ])
    })
    it('Happy: accepts valid answers with something else and other details and redirects to WATER_POLLUTION_POLLUTION_APPEARANCE', async () => {
      const answerId = question.answers.somethingElse.answerId.toString()
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetail: 'something else'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.somethingElse.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetail.answerId,
        otherDetails: 'something else'
      }])
    })
    it('Happy: Redirects to referer when set', async () => {
      const answerId = question.answers.sewage.answerId.toString()
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
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select what you think the pollution is, or &#39;you do not know&#39;')
    })
    it('Happy: Redirects to referer when set', async () => {
      const answerId = question.answers.sewage.answerId.toString()
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
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_POLLUTION_SUBSTANCE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.sewage.answerId
      }])
    })
  })
})
