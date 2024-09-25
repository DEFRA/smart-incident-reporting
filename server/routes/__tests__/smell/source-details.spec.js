import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_SOURCE_DETAILS
const question = questionSets.SMELL.questions.SMELL_SOURCE_DETAILS
const header = question.text
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const payload = {
  answerId: 'yes',
  siteName: 'Site name',
  sourceAddress: 'Address Line',
  sourceTown: 'town or city',
  sourcePostcode: 'WA4 1HT'
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  describe('POST', () => {
    it('Happy: accepts valid answerId no and redirects to smell/contact-local-council', async () => {
      const answerId = 'no'
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CONTACT_LOCAL_COUNCIL)
    })

    // Happy: Accepts a complete address
    it('Happy: accepts valid answerId yes and complete address with valid postcode', async () => {
      const options = {
        url,
        payload
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_LOCATION_HOME)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE_DETAILS)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.siteName.answerId,
        otherDetails: payload.siteName
      }, {
        ...baseAnswer,
        answerId: question.answers.sourceAddress.answerId,
        otherDetails: payload.sourceAddress
      }, {
        ...baseAnswer,
        answerId: question.answers.sourceTown.answerId,
        otherDetails: payload.sourceTown
      }, {
        ...baseAnswer,
        answerId: question.answers.sourcePostcode.answerId,
        otherDetails: payload.sourcePostcode
      }])
    })
    // Happy: Accepts a partial address, but with complete mandatory fields
    it('Happy: accepts valid answerId yes and complete address with valid postcode', async () => {
      const partialPayload = JSON.parse(JSON.stringify(payload))
      partialPayload.sourceAddress = ''

      const options = {
        url,
        payload: partialPayload
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_LOCATION_HOME)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE_DETAILS)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.siteName.answerId,
        otherDetails: payload.siteName
      }, {
        ...baseAnswer,
        answerId: question.answers.sourceAddress.answerId,
        otherDetails: ''
      }, {
        ...baseAnswer,
        answerId: question.answers.sourceTown.answerId,
        otherDetails: payload.sourceTown
      }, {
        ...baseAnswer,
        answerId: question.answers.sourcePostcode.answerId,
        otherDetails: payload.sourcePostcode
      }])
    })
    it('Happy: accepts valid answerId yes and strips out postcode with special characters', async () => {
      const partialPayload = JSON.parse(JSON.stringify(payload))
      partialPayload.sourcePostcode = 'WA4 &^%$%$--1HT'

      const options = {
        url,
        payload: partialPayload
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_LOCATION_HOME)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SOURCE_DETAILS)).toEqual([{
        ...baseAnswer,
        answerId: question.answers.siteName.answerId,
        otherDetails: payload.siteName
      }, {
        ...baseAnswer,
        answerId: question.answers.sourceAddress.answerId,
        otherDetails: payload.sourceAddress
      }, {
        ...baseAnswer,
        answerId: question.answers.sourceTown.answerId,
        otherDetails: payload.sourceTown
      }, {
        ...baseAnswer,
        answerId: question.answers.sourcePostcode.answerId,
        otherDetails: 'WA4 1HT'
      }])
    })
    it('Sad: errors on no fields provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Answer yes if you can give details about where the smell is coming from')
    })
    it('Sad: valid answerId yes but errors on no fields provided', async () => {
      const answerId = 'yes'
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a name')
      expect(response.payload).toContain('Enter a town or city')
    })
    it('Sad: errors on invalid postcode provided', async () => {
      const options = {
        url,
        payload: {
          ...payload,
          sourcePostcode: 'sdgfsfdgfdsgfdg'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a full UK postcode')
    })
  })
})
