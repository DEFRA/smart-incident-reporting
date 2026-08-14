import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_OPTION,
    redirect: {
      locationMap: constants.routes.SMELL_LOCATION_MAP,
      locationDescription: constants.routes.SMELL_LOCATION_DESCRIPTION
    }
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_OPTION,
    redirect: {
      locationMap: constants.routes.NOISE_LOCATION_MAP,
      locationDescription: constants.routes.NOISE_LOCATION_DESCRIPTION
    }
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_OPTION,
    redirect: {
      locationMap: constants.routes.DUST_LOCATION_MAP,
      locationDescription: constants.routes.DUST_LOCATION_DESCRIPTION
    }
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_OPTION,
    redirect: {
      locationMap: constants.routes.LITTER_LOCATION_MAP,
      locationDescription: constants.routes.LITTER_LOCATION_DESCRIPTION
    }
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_OPTION,
    redirect: {
      locationMap: constants.routes.MUD_LOCATION_MAP,
      locationDescription: constants.routes.MUD_LOCATION_DESCRIPTION
    }
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_OPTION,
    redirect: {
      locationMap: constants.routes.VERMIN_LOCATION_MAP,
      locationDescription: constants.routes.VERMIN_LOCATION_DESCRIPTION
    }
  }
]

describe('RARS Location Option Routes', () => {
  describe.each(problems)('$problem location option', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'How do you want to tell us where the problem is?')
      })
    })
  })

  describe.each(problems)('$problem location option unhappy path', ({ url }) => {
    describe('POST', () => {
      it('Should return error state when no option selected', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Select how you want to give the location')
      })
    })
  })

  describe.each(problems)('$problem location option redirect', ({ url, redirect }) => {
    describe('POST', () => {
      it.each([{ answerId: 2602 }, { answerId: 2603 }])(
        'Happy: map and gps redirect to location map',
        async (answer) => {
          const options = { url, payload: answer }
          const response = await submitPostRequest(options)
          expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
          expect(response.headers.location).toBe(redirect.locationMap)
        }
      )

      it('Happy: description redirects to location description', async () => {
        const options = { url, payload: { answerId: 2601 } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.locationDescription)
      })
    })
  })
})
