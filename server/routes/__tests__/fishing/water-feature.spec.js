import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.FISHING_WATER_FEATURE
const header = 'In what kind of water have you seen illegal fishing?'
const question = questionSets.FISHING.questions.FISHING_WATER_FEATURE
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
    it(`Should return success response and correct view when a river is selected for ${url}`, async () => {
      const sessionData = {
        'fishing/water-feature': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.river.answerId
        }]
      }
      const response = await submitGetRequest({ url }, 'In what kind of water have you seen illegal fishing?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="501" checked data-aria-controls="conditional-answerId">')
    })
    it(`Should return success response and correct view when the sea is selected for ${url}`, async () => {
      const sessionData = {
        'fishing/water-feature': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.sea.answerId
        }]
      }
      const response = await submitGetRequest({ url }, 'In what kind of water have you seen illegal fishing?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-3" name="answerId" type="radio" value="503" checked>')
    })
    it(`Should return success response and correct view when canal is selected with further details for ${url}`, async () => {
      const sessionData = {
        'fishing/water-feature': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.canal.answerId
        }, {
          questionId: baseAnswer.questionId,
          answerId: question.answers.canalDetails.answerId,
          otherDetails: 'test details'
        }]
      }
      const response = await submitGetRequest({ url }, 'In what kind of water have you seen illegal fishing?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-4" name="answerId" type="radio" value="504" checked data-aria-controls="conditional-answerId-4">')
      expect(response.payload).toContain('value="test details">')
    })
    it(`Should return success response and correct view when something else is selected with further details for ${url}`, async () => {
      const sessionData = {
        'fishing/water-feature': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.somethingElse.answerId
        }, {
          questionId: baseAnswer.questionId,
          answerId: question.answers.somethingElseDetails.answerId,
          otherDetails: 'test details'
        }]
      }
      const response = await submitGetRequest({ url }, 'In what kind of water have you seen illegal fishing?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-6" name="answerId" type="radio" value="506" checked data-aria-controls="conditional-answerId-6">')
      expect(response.payload).toContain('value="test details">')
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answerId of a river with further and redirects to location-option ', async () => {
      const answerId = question.answers.river.answerId
      const riverDetails = 'test other details'
      const options = {
        url,
        payload: {
          answerId,
          riverDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.FISHING_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.riverDetails.answerId,
        otherDetails: riverDetails
      }])
    })
    it('Happy: accepts valid answerId of a pond,lake or reservoir with further and redirects to location-option ', async () => {
      const answerId = question.answers.lakeOrReservoir.answerId
      const lakeOrReservoirDetails = 'test other details'
      const options = {
        url,
        payload: {
          answerId,
          lakeOrReservoirDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.FISHING_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.lakeOrReservoirDetails.answerId,
        otherDetails: lakeOrReservoirDetails
      }])
    })
    it('Happy: accepts valid answerId of a canal with further and redirects to location-option ', async () => {
      const answerId = question.answers.canal.answerId
      const canalDetails = 'test other details'
      const options = {
        url,
        payload: {
          answerId,
          canalDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.FISHING_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.canalDetails.answerId,
        otherDetails: canalDetails
      }])
    })
    it('Happy: accepts valid answerId of smaller stream or watercourse with further details and redirects to location-option ', async () => {
      const answerId = question.answers.streamOrWatercourse.answerId
      const streamOrWatercourseDetails = 'test other details'
      const options = {
        url,
        payload: {
          answerId,
          streamOrWatercourseDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.FISHING_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.streamOrWatercourseDetails.answerId,
        otherDetails: streamOrWatercourseDetails
      }])
    })
    it('Happy: accepts valid answerId of something else with further details and redirects to location-option', async () => {
      const answerId = question.answers.somethingElse.answerId
      const somethingElseDetails = 'test other details'
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.FISHING_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetails.answerId,
        otherDetails: somethingElseDetails
      }])
    })
    it('Happy: accepts valid answerId of you do not know and redirects to location-option', async () => {
      const answerId = question.answers.youDoNotKnow.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.FISHING_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.FISHING_WATER_FEATURE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select a type of watercourse or feature, or you do not know')
    })
  })
})
