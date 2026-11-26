import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'
import { findSitesNearby } from '../../../services/nearby-sites.js'
import { findNearestPostcode } from '../../../services/find-location.js'

jest.mock('../../../services/nearby-sites.js', () => ({
  findSitesNearby: jest.fn()
}))

jest.mock('../../../services/find-location.js', () => ({
  findNearestPostcode: jest.fn()
}))

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_DESCRIPTION_OPTIONAL

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.SMELL_CHOOSE_SITE,
    chooseSiteUrl: constants.routes.SMELL_CHOOSE_SITE
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.NOISE_CHOOSE_SITE,
    chooseSiteUrl: constants.routes.NOISE_CHOOSE_SITE
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.DUST_CHOOSE_SITE,
    chooseSiteUrl: constants.routes.DUST_CHOOSE_SITE
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.LITTER_CHOOSE_SITE,
    chooseSiteUrl: constants.routes.LITTER_CHOOSE_SITE
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.MUD_CHOOSE_SITE,
    chooseSiteUrl: constants.routes.MUD_CHOOSE_SITE
  },
  {
    problem: 'vermin/pests',
    url: constants.routes.PESTS_LOCATION_DESCRIPTION_OPTIONAL,
    redirectUrl: constants.routes.PESTS_CHOOSE_SITE,
    chooseSiteUrl: constants.routes.PESTS_CHOOSE_SITE
  }
]

describe('RARS Location Description Optional Routes', () => {
  afterEach(() => jest.resetAllMocks())

  it('updates the displayed postcode when changing from an address to a map location', async () => {
    const addressQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
    const sessionData = {
      [constants.redisKeys.RARS_CONFIRM_ADDRESS]: { selectedAddress: [{ postcode: 'TE1 0ST' }] },
      [constants.redisKeys.RARS_LOCATION_ADDRESS]: [{
        answerId: addressQuestion.answers.postcode.answerId,
        otherDetails: 'TE1 0ST'
      }],
      [constants.redisKeys.RARS_NEARBY_SITES]: [{ id: 'old', name: 'Old Site' }]
    }
    const oldList = await submitGetRequest({ url: constants.routes.SMELL_CHOOSE_SITE }, 'Choose the site you want to report', constants.statusCodes.OK, sessionData)
    expect(oldList.payload).toContain('of <b>TE1 0ST</b>')

    findNearestPostcode.mockResolvedValueOnce('BA1 1UB')
    await submitPostRequest({ url: constants.routes.SMELL_LOCATION_MAP, payload: { point: '[374999,164393]' } })
    findSitesNearby.mockResolvedValueOnce({ sites: [{ id: 'new', name: 'New Site' }], apiDown: false })
    await submitPostRequest({ url: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL, payload: {} })
    const newList = await submitGetRequest({ url: constants.routes.SMELL_CHOOSE_SITE }, 'Choose the site you want to report')

    expect(findSitesNearby).toHaveBeenCalledWith(374999, 164393)
    expect(newList.payload).toContain('nearest address postcode: <b>BA1 1UB</b>')
    expect(newList.payload).toContain('New Site')
    expect(newList.payload).not.toContain('TE1 0ST')
    expect(newList.payload).not.toContain('Old Site')
  })

  describe.each(problems)('$problem location description optional', ({ problem, url, redirectUrl, chooseSiteUrl }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const response = await submitGetRequest({ url }, 'Other location information (optional)')
        expect(response.statusCode).toEqual(200)
        expect(response.payload).toContain('Other location information (optional)')
        expect(response.payload).toContain('name="otherLocationInfo"')
      })

      it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
        const sessionData = {
          [question.key]: [{
            questionId: question.questionId,
            questionAsked: question.text,
            questionResponse: true,
            answerId: question.answers.locationDetails.answerId,
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
        const storedData = response.request.yar.get(question.key)
        expect(storedData).toEqual([{
          questionId: question.questionId,
          questionAsked: question.text,
          questionResponse: true,
          answerId: question.answers.locationDetails.answerId,
          otherDetails: locationInfo
        }])
        expect(response.headers.location).toEqual(redirectUrl)
      })

      it('searches near the point stored by the map page', async () => {
        findSitesNearby.mockResolvedValueOnce({ sites: [{ id: 'site-1', name: 'Test Site', address: '' }], apiDown: false })
        const sessionData = {
          [constants.redisKeys.RARS_LOCATION_MAP]: [
            { otherDetails: 'SU 00000 00000' },
            { otherDetails: '374999' },
            { otherDetails: '164393' }
          ]
        }

        const response = await submitPostRequest({
          url: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL,
          payload: { otherLocationInfo: 'Near the railway bridge' }
        }, constants.statusCodes.REDIRECT, sessionData)

        expect(findSitesNearby).toHaveBeenCalledWith(374999, 164393)
        expect(response.headers.location).toEqual(constants.routes.SMELL_CHOOSE_SITE)
      })

      it.each([
        ['BA1 1UB', 'your selected location (nearest address postcode: <b>BA1 1UB</b>)'],
        [null, 'your selected location.']
      ])('shows the current map location when the nearest postcode is %s', async (postcode, locationText) => {
        findSitesNearby.mockResolvedValueOnce({ sites: [{ id: 'site-1', name: 'New Site' }], apiDown: false })
        findNearestPostcode.mockResolvedValueOnce(postcode)
        const addressQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
        const sessionData = {
          [constants.redisKeys.RARS_CONFIRM_ADDRESS]: { selectedAddress: [{ postcode: 'TE1 0ST' }] },
          [constants.redisKeys.RARS_LOCATION_ADDRESS]: [{
            answerId: addressQuestion.answers.postcode.answerId,
            otherDetails: 'TE1 0ST'
          }],
          [constants.redisKeys.RARS_LOCATION_MAP]: [
            { otherDetails: 'ST 74999 64393' },
            { otherDetails: '374999' },
            { otherDetails: '164393' }
          ]
        }

        await submitPostRequest({
          url: constants.routes.SMELL_LOCATION_MAP,
          payload: { point: '[374999,164393]' }
        }, constants.statusCodes.REDIRECT, sessionData)
        await submitPostRequest({ url, payload: {} })
        const response = await submitGetRequest({ url: chooseSiteUrl }, 'Choose the site you want to report')

        expect(findNearestPostcode).toHaveBeenCalledWith(374999, 164393)
        expect(response.payload).toContain(locationText)
        expect(response.payload).toContain('New Site')
        expect(response.payload).not.toContain('TE1 0ST')
      })

      it('redirects to choose site with no nearby results when map coordinates are unavailable', async () => {
        const response = await submitPostRequest({
          url,
          payload: { otherLocationInfo: 'Near the railway bridge' }
        }, constants.statusCodes.REDIRECT)

        expect(findSitesNearby).not.toHaveBeenCalled()
        expect(findNearestPostcode).not.toHaveBeenCalled()
        expect(response.headers.location).toEqual(chooseSiteUrl)
        expect(response.request.yar.get(constants.redisKeys.RARS_NEARBY_SITES)).toEqual([])
      })

      it('redirects to choose site when the lookup finds no nearby sites', async () => {
        findSitesNearby.mockResolvedValueOnce({ sites: [], apiDown: false })
        const sessionData = {
          [constants.redisKeys.RARS_LOCATION_MAP]: [
            { otherDetails: 'SU 00000 00000' },
            { otherDetails: '374999' },
            { otherDetails: '164393' }
          ]
        }

        const response = await submitPostRequest({
          url,
          payload: { otherLocationInfo: 'Near the railway bridge' }
        }, constants.statusCodes.REDIRECT, sessionData)

        expect(findSitesNearby).toHaveBeenCalledWith(374999, 164393)
        expect(response.headers.location).toEqual(chooseSiteUrl)
        expect(response.request.yar.get(constants.redisKeys.RARS_NEARBY_SITES)).toEqual([])
      })

      it('Should not store data when payload is empty', async () => {
        const options = {
          url,
          payload: {}
        }
        const response = await submitPostRequest(options)
        const storedData = response.request.yar.get(question.key)
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
        const storedData = response.request.yar.get(question.key)
        expect(storedData).toBeFalsy()
        expect(response.headers.location).toEqual(redirectUrl)
      })

      it('Should show an error and not progress when the location info exceeds the character limit', async () => {
        const otherLocationInfo = 'a'.repeat(constants.locationDescriptionCharacterLimit + 1)
        const options = {
          url,
          payload: {
            otherLocationInfo
          }
        }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(`Other location information must be ${constants.locationDescriptionCharacterLimit} characters or less`)
        expect(response.request.yar.get(question.key)).toBeFalsy()
      })

      it('Should accept location info at the character limit', async () => {
        const otherLocationInfo = 'a'.repeat(constants.locationDescriptionCharacterLimit)
        const options = {
          url,
          payload: {
            otherLocationInfo
          }
        }
        const response = await submitPostRequest(options)
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
