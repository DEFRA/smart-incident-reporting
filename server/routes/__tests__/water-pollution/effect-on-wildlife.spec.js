import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_EFFECT_ON_WILDLIFE
const header = question.text
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
    it(`Should return success response and correct view when yes is selected for ${url}`, async () => {
      const sessionData = {
        'water-pollution/effect-on-wildlife': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.yes.answerId
        }]
      }
      const response = await submitGetRequest({ url }, 'Have you seen any dead or distressed fish or animals nearby?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="201" checked data-aria-controls="conditional-answerId">')
    })
    it(`Should return success response and correct view when no is selected for ${url}`, async () => {
      const sessionData = {
        'water-pollution/effect-on-wildlife': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.no.answerId
        }]
      }
      const response = await submitGetRequest({ url }, 'Have you seen any dead or distressed fish or animals nearby?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="202"')
    })
    it(`Should return success response and correct view when yes is selected with yesDetails for ${url}`, async () => {
      const sessionData = {
        'water-pollution/effect-on-wildlife': [{
          questionId: baseAnswer.questionId,
          answerId: question.answers.yes.answerId
        }, {
          questionId: baseAnswer.questionId,
          answerId: question.answers.yesDetails.answerId,
          otherDetails: 'Further details'
        }]
      }
      const response = await submitGetRequest({ url }, 'Have you seen any dead or distressed fish or animals nearby?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="201" checked data-aria-controls="conditional-answerId">')
      expect(response.payload).toContain('Further details</textarea>')
    })
  })

  describe('POST', () => {
    it('Happy accepts Yes and yes Details and forwards to WATER_POLLUTION_CONTACT_DETAILS', async () => {
      const answerId = question.answers.yes.answerId
      const yesDetails = 'Further details'
      const options = {
        url,
        payload: {
          answerId,
          yesDetails
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }, {
        ...baseAnswer,
        answerId: question.answers.yesDetails.answerId,
        otherDetails: yesDetails
      }])
    })
    it('Happy accepts Yes and empty yes details and forwards to WATER_POLLUTION_CONTACT_DETAILS', async () => {
      const answerId = question.answers.yes.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.yes.answerId
      }])
    })
    it('Happy accepts No and forwards to WATER_POLLUTION_CONTACT_DETAILS', async () => {
      const answerId = question.answers.no.answerId
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
      expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.no.answerId
      }])
    })
    it('Sad rejects empty payload', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select yes if you&#39;ve seen dead or distressed fish or other animals nearby')
    })
  })
})
