import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_TYPE
const header = questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE
const question = questionSets.BLOCKAGE.questions.BLOCKAGE_TYPE
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header.text)
    })
    it(`Should return success response and correct view when a fallenTree is selected for ${url}`, async () => {
      const sessionData = {
        'blockage/blockage-type': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.fallenTree.answerId
        }]
      }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="111" checked>')
    })
    it(`Should return success response and correct view when the vehicle is selected for ${url}`, async () => {
      const sessionData = {
        'blockage/blockage-type': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.vehicle.answerId
        }]
      }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="112" checked>')
    })
    it(`Should return success response and correct view when rubbish is selected  for ${url}`, async () => {
      const sessionData = {
        'blockage/blockage-type': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.rubbish.answerId
        }]
      }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-3" name="answerId" type="radio" value="113" checked>')
    })
    it(`Should return success response and correct view when deliberate is selected  for ${url}`, async () => {
      const sessionData = {
        'blockage/blockage-type': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.deliberate.answerId
        }]
      }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-4" name="answerId" type="radio" value="114" checked>')
    })
    it(`Should return success response and correct view when something else is selected for ${url}`, async () => {
      const sessionData = {
        'blockage/blockage-type': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.somethingElse.answerId
        }, {
          questionId: baseAnswer.questionId,
          answerId: question.answers.somethingElseDetails.answerId,
          otherDetails: 'test details'
        }]
      }
      const response = await submitGetRequest({ url }, question.text, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-5" name="answerId" type="radio" value="115" checked data-aria-controls="conditional-answerId-5">')
      expect(response.payload).toContain('value="test details">')
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answerId of fallenTree and redirects to location-option', async () => {
      const answerId = question.answers.fallenTree.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_TYPE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of vehicle and redirects to location-option', async () => {
      const answerId = question.answers.vehicle.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_TYPE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of a rubbish redirects to location-option ', async () => {
      const answerId = question.answers.rubbish.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_TYPE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of a deliberate with further and redirects to location-option ', async () => {
      const answerId = question.answers.deliberate.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_TYPE)).toEqual([{
        ...baseAnswer,
        answerId
      }])
    })
    it('Happy: accepts valid answerId of something else with further details ', async () => {
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
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_LOCATION_OPTION)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_TYPE)).toEqual([{
        ...baseAnswer,
        answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.somethingElseDetails.answerId,
        otherDetails: somethingElseDetails
      }])
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select what&#39;s blocking the river or you do not know')
    })
    it('Sad: Somethingelse option is selected and no somethingelse details added ', async () => {
      const answerId = question.answers.somethingElse.answerId
      const somethingElseDetails = ''
      const options = {
        url,
        payload: {
          answerId,
          somethingElseDetails
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter details of what&#39;s blocking the river')
    })
  })
})
