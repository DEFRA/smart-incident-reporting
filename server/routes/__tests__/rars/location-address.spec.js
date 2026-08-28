import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const payload = {
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  townOrCity: 'Testtown',
  county: 'Testshire',
  postcode: 'TE1 0ST'
}

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_LOCATION_ADDRESS, redirect: constants.routes.SMELL_DESCRIPTION },
  { problem: 'noise', url: constants.routes.NOISE_LOCATION_ADDRESS, redirect: constants.routes.NOISE_DESCRIPTION },
  { problem: 'dust', url: constants.routes.DUST_LOCATION_ADDRESS, redirect: constants.routes.DUST_DESCRIPTION },
  { problem: 'litter', url: constants.routes.LITTER_LOCATION_ADDRESS, redirect: constants.routes.LITTER_DESCRIPTION },
  { problem: 'mud', url: constants.routes.MUD_LOCATION_ADDRESS, redirect: constants.routes.MUD_DESCRIPTION },
  { problem: 'vermin', url: constants.routes.VERMIN_LOCATION_ADDRESS, redirect: constants.routes.VERMIN_RECURRING }
]

describe('RARS Location Address Routes', () => {
  describe.each(problems)('$problem location address', ({ url, redirect }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, question.text)
      })
    })

    describe('POST', () => {
      it('Happy: accepts a complete address with valid postcode', async () => {
        const options = { url, payload }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_LOCATION_ADDRESS)).toEqual([{
          ...baseAnswer,
          answerId: question.answers.addressLine1.answerId,
          otherDetails: payload.addressLine1
        }, {
          ...baseAnswer,
          answerId: question.answers.addressLine2.answerId,
          otherDetails: payload.addressLine2
        }, {
          ...baseAnswer,
          answerId: question.answers.townOrCity.answerId,
          otherDetails: payload.townOrCity
        }, {
          ...baseAnswer,
          answerId: question.answers.county.answerId,
          otherDetails: payload.county
        }, {
          ...baseAnswer,
          answerId: question.answers.postcode.answerId,
          otherDetails: payload.postcode
        }])
      })

      it('Happy: accepts a partial address with only mandatory fields', async () => {
        const partialPayload = { ...payload }
        delete partialPayload.addressLine2
        delete partialPayload.county

        const options = { url, payload: partialPayload }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_LOCATION_ADDRESS)).toEqual([{
          ...baseAnswer,
          answerId: question.answers.addressLine1.answerId,
          otherDetails: payload.addressLine1
        }, {
          ...baseAnswer,
          answerId: question.answers.townOrCity.answerId,
          otherDetails: payload.townOrCity
        }, {
          ...baseAnswer,
          answerId: question.answers.postcode.answerId,
          otherDetails: payload.postcode
        }])
      })

      it('Happy: strips special characters from postcode', async () => {
        const options = { url, payload: { ...payload, postcode: 'TE1 &^%--0ST' } }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_LOCATION_ADDRESS)).toEqual(
          expect.arrayContaining([expect.objectContaining({
            answerId: question.answers.postcode.answerId,
            otherDetails: 'TE1 0ST'
          })])
        )
      })

      it('Sad: errors when no fields provided', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter the first line of the address, for example house number and street')
        expect(response.payload).toContain('Enter a town or city')
        expect(response.payload).toContain('Enter a postcode')
      })

      it('Sad: errors on invalid postcode', async () => {
        const options = { url, payload: { ...payload, postcode: 'INVALID123' } }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a full postcode, for example W1 8QS')
      })
    })
  })
})
