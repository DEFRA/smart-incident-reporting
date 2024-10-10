import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_SOURCE
const header = 'Where is the smell coming from?'
const question = questionSets.SMELL.questions.SMELL_SOURCE
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answerId of a waste site and redirects to smell/source-detais', async () => {
      const answerId = question.answers.wasteSite.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_SOURCE_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of a large industrial site, factory or business and redirects to smell/source-detais', async () => {
      const answerId = question.answers.industry.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_SOURCE_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of a sewage or water treatment works and redirects to smell/source-detais', async () => {
      const answerId = question.answers.sewage.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_SOURCE_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of an Agricultural site or activity and redirects to smell/source-detais', async () => {
      const answerId = question.answers.wasteSpreading.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_SOURCE_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of a small local business and redirects to smell/report-local-council', async () => {
      const answerId = question.answers.local.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_REPORT_LOCAL_COUNCIL)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of a neighbouring property and redirects to smell/report-local-council', async () => {
      const answerId = question.answers.neighbour.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_REPORT_LOCAL_COUNCIL)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of household waste and rubbish and redirects to smell/report-local-council', async () => {
      const answerId = question.answers.rubbish.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_REPORT_LOCAL_COUNCIL)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of unknown and redirects to smell/contact-local-council', async () => {
      const answerId = question.answers.unknown.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CONTACT_LOCAL_COUNCIL)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE)).toEqual([{
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
      expect(response.payload).toContain('Select a type of place or activity where the smell is coming from')
    })
  })
})
