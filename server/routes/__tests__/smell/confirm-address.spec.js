import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_CONFIRM_ADDRESS
const header = 'Confirm address'
const session = {
  'smell/confirm-address': {
    selectedAddress: [
      {
        uprn: '10001142725',
        postcode: 'BA1 1UB',
        address: 'Carpenter House, 35, Broad Quay, Bath, BA1 1UB',
        x: 365739,
        y: 343015
      }
    ]
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`Happy: Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, session)
      expect(response.payload).toContain('Carpenter House, 35, Broad Quay<br>Bath<br>BA1 1UB')
    })
  })
  describe('POST', () => {
    it('Happy: accept and store the address as a national grid reference', async () => {
      const question1 = questionSets.SMELL.questions.SMELL_LOCATION_ADDRESS
      const baseAnswer1 = {
        questionId: question1.questionId,
        questionAsked: question1.text,
        questionResponse: true
      }
      const question2 = questionSets.SMELL.questions.SMELL_LOCATION_MAP
      const baseAnswer2 = {
        questionId: question2.questionId,
        questionAsked: question2.text,
        questionResponse: true
      }
      const options = {
        url
      }
      const response = await submitPostRequest(options, 302, session)
      expect(response.headers.location).toEqual(constants.routes.SMELL_PREVIOUS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_ADDRESS)).toEqual([{
        ...baseAnswer1,
        answerId: question1.answers.addressLine1.answerId,
        otherDetails: 'Carpenter House, 35, Broad Quay'
      }, {
        ...baseAnswer1,
        answerId: question1.answers.addressLine2.answerId,
        otherDetails: ''
      }, {
        ...baseAnswer1,
        answerId: question1.answers.townOrCity.answerId,
        otherDetails: 'Bath'
      }, {
        ...baseAnswer1,
        answerId: question1.answers.county.answerId,
        otherDetails: ''
      }, {
        ...baseAnswer1,
        answerId: question1.answers.postcode.answerId,
        otherDetails: 'BA1 1UB'
      }])
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_MAP)).toEqual([{
        ...baseAnswer2,
        answerId: question2.answers.nationalGridReference.answerId,
        otherDetails: 'SJ 65739 43015'
      }, {
        ...baseAnswer2,
        answerId: question2.answers.easting.answerId,
        otherDetails: '365739'
      }, {
        ...baseAnswer2,
        answerId: question2.answers.northing.answerId,
        otherDetails: '343015'
      }, {
        ...baseAnswer2,
        answerId: question2.answers.lng.answerId,
        otherDetails: '-2.511757'
      }, {
        ...baseAnswer2,
        answerId: question2.answers.lat.answerId,
        otherDetails: '52.983388'
      }])
    })
  })
})
