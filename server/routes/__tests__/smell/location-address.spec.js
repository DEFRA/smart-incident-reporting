import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_LOCATION_ADDRESS
const question = questionSets.SMELL.questions.SMELL_LOCATION_ADDRESS
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const payload = {
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  townOrCity: 'town or city',
  county: 'county',
  postcode: 'WA4 1HT',
  homeAddress: 'homeAddress'
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    // Happy: Accepts a complete address
    it('Happy: accepts a complete address with valid postcode', async () => {
      const options = {
        url,
        payload
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_SMELL_SOURCE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_ADDRESS)).toEqual([{
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
      }, {
        ...baseAnswer,
        answerId: question.answers.homeAddress.answerId
      }])
    })
    // Happy: Accepts a partial address, but with complete mandatory fields
    it('Happy: accepts a complete address with valid postcode', async () => {
      let partialPayload = JSON.parse(JSON.stringify(payload))
      delete partialPayload.addressLine2
      delete partialPayload.county
      delete partialPayload.homeAddress

      const options = {
        url,
        payload: partialPayload
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_SMELL_SOURCE)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_ADDRESS)).toEqual([{
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
    it('Sad: errors on no fields provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter the first line of the address, for example house number and street')
      expect(response.payload).toContain('Enter the town or city')
      expect(response.payload).toContain('Enter a postcode')
    })
    it('Sad: errors on invalid postcode provided', async () => {
      const options = {
        url,
        payload: {
          ...payload,
          postcode: 'sdgfsfdgfdsgfdg'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a full postcode, for example W1 8QS')
    })
  })
})
