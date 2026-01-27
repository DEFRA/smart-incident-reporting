import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_CONFIRM_ADDRESS
const header = 'Confirm address'
const sessionData01 = {
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

const sessionData02 = {
  'smell/confirm-address': {
    selectedAddress: [
      {
        uprn: '10001142726',
        postcode: 'BS2 7EB',
        address: 'Eaglestone Champion Ltd, Unit 95, The Industrial Quarter, Foxcote Avenue, Bristol Business Park, Peasedown St. John, Bristol, BS2 7EB',
        x: 365739,
        y: 343015
      }
    ]
  }
}

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

describe(url, () => {
  describe('GET', () => {
    it('Happy: Should return success response and correct view for single line address', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData01)
      expect(response.payload).toContain('Carpenter House, 35, Broad Quay<br>Bath<br>BA1 1UB')
    })
    it('Happy: Should return success response and correct view for double line address', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData02)
      expect(response.payload).toContain('Eaglestone Champion Ltd, Unit 95, The Industrial Quarter<br>Foxcote Avenue, Bristol Business Park, Peasedown St. John<br>Bristol<br>BS2 7EB')
    })
  })
  describe('POST', () => {
    it('Happy: accept and store the single line address as a national grid reference', async () => {
      const response = await submitPostRequest(options, 302, sessionData01)
      expect(response.headers.location).toEqual(constants.routes.SMELL_DESCRIPTION)
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
    it('Happy: accept and store the double line address as a national grid reference', async () => {
      const response = await submitPostRequest(options, 302, sessionData02)
      expect(response.headers.location).toEqual(constants.routes.SMELL_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_LOCATION_ADDRESS)).toEqual([{
        ...baseAnswer1,
        answerId: question1.answers.addressLine1.answerId,
        otherDetails: 'Eaglestone Champion Ltd, Unit 95, The Industrial Quarter'
      }, {
        ...baseAnswer1,
        answerId: question1.answers.addressLine2.answerId,
        otherDetails: 'Foxcote Avenue, Bristol Business Park, Peasedown St. John'
      }, {
        ...baseAnswer1,
        answerId: question1.answers.townOrCity.answerId,
        otherDetails: 'Bristol'
      }, {
        ...baseAnswer1,
        answerId: question1.answers.county.answerId,
        otherDetails: ''
      }, {
        ...baseAnswer1,
        answerId: question1.answers.postcode.answerId,
        otherDetails: 'BS2 7EB'
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
