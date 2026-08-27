import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'

const addressQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
const locationMapQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_MAP

const baseAddressAnswer = {
  questionId: addressQuestion.questionId,
  questionAsked: addressQuestion.text,
  questionResponse: true
}

const baseMapAnswer = {
  questionId: locationMapQuestion.questionId,
  questionAsked: locationMapQuestion.text,
  questionResponse: true
}

const singleLineSession = {
  [constants.redisKeys.RARS_CONFIRM_ADDRESS]: {
    selectedAddress: [
      {
        uprn: '10001150001',
        postcode: 'TE1 0ST',
        address: 'Test House, 5, Example Street, Testtown, TE1 0ST',
        x: 365739,
        y: 343015
      }
    ]
  }
}

const doubleLineSession = {
  [constants.redisKeys.RARS_CONFIRM_ADDRESS]: {
    selectedAddress: [
      {
        uprn: '10001150002',
        postcode: 'TE2 1LP',
        address: 'Testco Ltd, Unit 5, The Business Quarter, Long Lane, Meadow Court, Testville, TE2 1LP',
        x: 365739,
        y: 343015
      }
    ]
  }
}

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_CONFIRM_ADDRESS, redirect: constants.routes.SMELL_DESCRIPTION },
  { problem: 'noise', url: constants.routes.NOISE_CONFIRM_ADDRESS, redirect: constants.routes.NOISE_DESCRIPTION },
  { problem: 'dust', url: constants.routes.DUST_CONFIRM_ADDRESS, redirect: constants.routes.DUST_DESCRIPTION },
  { problem: 'litter', url: constants.routes.LITTER_CONFIRM_ADDRESS, redirect: constants.routes.LITTER_DESCRIPTION },
  { problem: 'mud', url: constants.routes.MUD_CONFIRM_ADDRESS, redirect: constants.routes.MUD_DESCRIPTION },
  { problem: 'vermin', url: constants.routes.VERMIN_CONFIRM_ADDRESS, redirect: constants.routes.VERMIN_DESCRIPTION }
]

describe('RARS Confirm Address Routes', () => {
  describe.each(problems)('$problem confirm address', ({ url, redirect }) => {
    describe('GET', () => {
      it('Happy: Should display a single-line address in the inset text', async () => {
        const response = await submitGetRequest({ url }, 'Confirm address', constants.statusCodes.OK, singleLineSession)
        expect(response.payload).toContain('Test House, 5, Example Street<br>Testtown<br>TE1 0ST')
      })

      it('Happy: Should display a double-line address in the inset text', async () => {
        const response = await submitGetRequest({ url }, 'Confirm address', constants.statusCodes.OK, doubleLineSession)
        expect(response.payload).toContain('Testco Ltd, Unit 5, The Business Quarter, Long Lane<br>Meadow Court<br>Testville<br>TE2 1LP')
      })
    })

    describe('POST', () => {
      it('Happy: stores location address and map answers then redirects to description', async () => {
        const options = { url }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, singleLineSession)
        expect(response.headers.location).toEqual(redirect)

        expect(response.request.yar.get(constants.redisKeys.RARS_LOCATION_ADDRESS)).toEqual([{
          ...baseAddressAnswer,
          answerId: addressQuestion.answers.addressLine1.answerId,
          otherDetails: 'Test House, 5, Example Street'
        }, {
          ...baseAddressAnswer,
          answerId: addressQuestion.answers.addressLine2.answerId,
          otherDetails: ''
        }, {
          ...baseAddressAnswer,
          answerId: addressQuestion.answers.townOrCity.answerId,
          otherDetails: 'Testtown'
        }, {
          ...baseAddressAnswer,
          answerId: addressQuestion.answers.county.answerId,
          otherDetails: ''
        }, {
          ...baseAddressAnswer,
          answerId: addressQuestion.answers.postcode.answerId,
          otherDetails: 'TE1 0ST'
        }])

        expect(response.request.yar.get(constants.redisKeys.RARS_LOCATION_MAP)).toEqual([{
          ...baseMapAnswer,
          answerId: locationMapQuestion.answers.nationalGridReference.answerId,
          otherDetails: 'SJ 65739 43015'
        }, {
          ...baseMapAnswer,
          answerId: locationMapQuestion.answers.easting.answerId,
          otherDetails: '365739'
        }, {
          ...baseMapAnswer,
          answerId: locationMapQuestion.answers.northing.answerId,
          otherDetails: '343015'
        }, {
          ...baseMapAnswer,
          answerId: locationMapQuestion.answers.lng.answerId,
          otherDetails: '-2.511757'
        }, {
          ...baseMapAnswer,
          answerId: locationMapQuestion.answers.lat.answerId,
          otherDetails: '52.983388'
        }])
      })
    })
  })
})
