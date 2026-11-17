import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import { questionSets } from '../../../utils/question-sets.js'
import constants from '../../../utils/constants.js'
import { findByPostcode } from '../../../services/find-location.js'
import { findSitesNearby } from '../../../services/nearby-sites.js'

jest.mock('../../../services/find-location.js', () => ({
  findByPostcode: jest.fn()
}))

jest.mock('../../../services/nearby-sites.js', () => ({
  findSitesNearby: jest.fn()
}))

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
  { problem: 'smell', url: constants.routes.SMELL_LOCATION_ADDRESS, redirect: constants.routes.SMELL_CHOOSE_SITE },
  { problem: 'noise', url: constants.routes.NOISE_LOCATION_ADDRESS, redirect: constants.routes.NOISE_CHOOSE_SITE },
  { problem: 'dust', url: constants.routes.DUST_LOCATION_ADDRESS, redirect: constants.routes.DUST_CHOOSE_SITE },
  { problem: 'litter', url: constants.routes.LITTER_LOCATION_ADDRESS, redirect: constants.routes.LITTER_CHOOSE_SITE },
  { problem: 'mud', url: constants.routes.MUD_LOCATION_ADDRESS, redirect: constants.routes.MUD_CHOOSE_SITE },
  { problem: 'vermin/pests', url: constants.routes.PESTS_LOCATION_ADDRESS, redirect: constants.routes.PESTS_CHOOSE_SITE }
]

describe('RARS Location Address Routes', () => {
  beforeEach(() => {
    findByPostcode.mockResolvedValue({ payload: { results: [] } })
  })

  afterEach(() => jest.resetAllMocks())

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

      it('uses the manually entered address point to search for nearby sites', async () => {
        findByPostcode.mockResolvedValueOnce({
          payload: {
            results: [{
              DPA: {
                ADDRESS: '123 TEST ROAD, TESTTOWN, TE1 0ST',
                POSTCODE: 'TE1 0ST',
                X_COORDINATE: 374999,
                Y_COORDINATE: 164393
              }
            }]
          }
        })
        findSitesNearby.mockResolvedValueOnce([{ id: 'site-1', name: 'Test Site', address: '' }])

        const response = await submitPostRequest({
          url: constants.routes.SMELL_LOCATION_ADDRESS,
          payload: { ...payload, addressLine1: '123 Test Road' }
        })

        expect(findByPostcode).toHaveBeenCalledWith(payload.postcode)
        expect(findSitesNearby).toHaveBeenCalledWith(374999, 164393)
        expect(response.headers.location).toEqual(constants.routes.SMELL_CHOOSE_SITE)
      })

      it('uses the only postcode point when OS Places returns one unmatched address', async () => {
        findByPostcode.mockResolvedValueOnce({
          payload: {
            results: [{
              DPA: {
                ADDRESS: 'EXAMPLE WATER LTD, TEST ROAD, TESTVILLE, TE1 0ST',
                POSTCODE: 'TE1 0ST',
                X_COORDINATE: 123456,
                Y_COORDINATE: 654321
              }
            }]
          }
        })
        findSitesNearby.mockResolvedValueOnce([{ id: 'site-1', name: 'Example Water Ltd', address: 'Example Treatment Works' }])

        const response = await submitPostRequest({
          url,
          payload: { ...payload, addressLine1: 'Example Treatment Works', postcode: 'TE1 0ST' }
        })

        expect(findSitesNearby).toHaveBeenCalledWith(123456, 654321)
        expect(response.headers.location).toEqual(redirect)
      })

      it('redirects to choose site with no nearby results when address lookup has no match', async () => {
        const response = await submitPostRequest({ url, payload })

        expect(findByPostcode).toHaveBeenCalledWith(payload.postcode)
        expect(findSitesNearby).not.toHaveBeenCalled()
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_NEARBY_SITES)).toEqual([])
      })

      it('redirects to choose site when the lookup finds no nearby sites', async () => {
        findByPostcode.mockResolvedValueOnce({
          payload: {
            results: [{
              DPA: {
                ADDRESS: 'ADDRESS LINE 1, ADDRESS LINE 2, TESTTOWN, TE1 0ST',
                POSTCODE: 'TE1 0ST',
                X_COORDINATE: 374999,
                Y_COORDINATE: 164393
              }
            }]
          }
        })
        findSitesNearby.mockResolvedValueOnce([])

        const response = await submitPostRequest({ url, payload })

        expect(findSitesNearby).toHaveBeenCalledWith(374999, 164393)
        expect(response.headers.location).toEqual(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_NEARBY_SITES)).toEqual([])
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
