import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.SMELL_DESCRIPTION
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.NOISE_DESCRIPTION
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.DUST_DESCRIPTION
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.LITTER_DESCRIPTION
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.MUD_DESCRIPTION
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.VERMIN_DESCRIPTION
  }
]

describe('RARS Location Description Optional Routes', () => {
  describe.each(problems)('$problem location description optional', ({ problem, url, redirectUrl }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const response = await submitGetRequest({ url }, 'Other location information (optional)')
        expect(response.statusCode).toEqual(200)
        expect(response.payload).toContain('Other location information (optional)')
        expect(response.payload).toContain('name="otherLocationInfo"')
      })

      it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
        const sessionData = {
          'rars/location-description': [{
            questionId: 1500,
            questionAsked: 'Describe the location',
            questionResponse: true,
            answerId: 1501,
            otherDetails: 'Details of other location information'
          }]
        }
        const response = await submitGetRequest({ url }, 'Other location information (optional)', constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('Details of other location information</textarea')
      })
    })

    describe('POST', () => {
      it('Should accept location info text, store in session, and redirect', async () => {
        const locationInfo = 'Near the railway bridge'
        const options = {
          url,
          payload: {
            otherLocationInfo: locationInfo
          }
        }
        const response = await submitPostRequest(options)
        const storedData = response.request.yar.get('rars/location-description')
        expect(storedData).toEqual([{
          questionId: 1500,
          questionAsked: 'Describe the location',
          questionResponse: true,
          answerId: 1501,
          otherDetails: locationInfo
        }])
        expect(response.headers.location).toEqual(redirectUrl)
      })

      it('Should not store data when payload is empty', async () => {
        const options = {
          url,
          payload: {}
        }
        const response = await submitPostRequest(options)
        const storedData = response.request.yar.get('rars/location-description')
        expect(storedData).toBeFalsy()
        expect(response.headers.location).toEqual(redirectUrl)
      })

      it('Should not store data when optional field is empty', async () => {
        const options = {
          url,
          payload: {
            otherLocationInfo: ''
          }
        }
        const response = await submitPostRequest(options)
        const storedData = response.request.yar.get('rars/location-description')
        expect(storedData).toBeFalsy()
        expect(response.headers.location).toEqual(redirectUrl)
      })

      it('Should accept location info with special characters and redirect', async () => {
        const options = {
          url,
          payload: {
            otherLocationInfo: 'By the park & recreation centre, next to the old factory'
          }
        }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirectUrl)
      })

      it('Should accept long location description and redirect', async () => {
        const longDescription = 'Behind the shopping centre, between Main Street and Park Avenue, near the traffic lights by the old bus station'
        const options = {
          url,
          payload: {
            otherLocationInfo: longDescription
          }
        }
        const response = await submitPostRequest(options)
        expect(response.headers.location).toEqual(redirectUrl)
      })

      it('Should update answer when resubmitting with new location info', async () => {
        const firstAnswer = 'First location description'
        const secondAnswer = 'Updated location description'

        // Submit first answer
        const firstOptions = {
          url,
          payload: { otherLocationInfo: firstAnswer }
        }
        const firstResponse = await submitPostRequest(firstOptions)
        expect(firstResponse.headers.location).toEqual(redirectUrl)

        // Submit updated answer
        const secondOptions = {
          url,
          payload: { otherLocationInfo: secondAnswer }
        }
        const secondResponse = await submitPostRequest(secondOptions)
        expect(secondResponse.headers.location).toEqual(redirectUrl)
      })
    })
  })
})
