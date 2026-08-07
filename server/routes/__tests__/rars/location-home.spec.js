import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_LOCATION_HOME,
    header: 'Where is the smell causing a problem?',
    errorText: 'Select a type of place or activity where the smell is coming from',
    redirect: {
      findAddress: constants.routes.SMELL_FIND_ADDRESS,
      locationOption: constants.routes.SMELL_LOCATION_OPTION
    }
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_LOCATION_HOME,
    header: 'Where is the noise causing a problem?',
    errorText: 'Select a type of place or activity where the noise is coming from',
    redirect: {
      findAddress: constants.routes.NOISE_FIND_ADDRESS,
      locationOption: constants.routes.NOISE_LOCATION_OPTION
    }
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_LOCATION_HOME,
    header: 'Where is the dust causing a problem?',
    errorText: 'Select a type of place or activity where the dust is coming from',
    redirect: {
      findAddress: constants.routes.DUST_FIND_ADDRESS,
      locationOption: constants.routes.DUST_LOCATION_OPTION
    }
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_LOCATION_HOME,
    header: 'Where is the litter causing a problem?',
    errorText: 'Select a type of place or activity where the litter is coming from',
    redirect: {
      findAddress: constants.routes.LITTER_FIND_ADDRESS,
      locationOption: constants.routes.LITTER_LOCATION_OPTION
    }
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_LOCATION_HOME,
    header: 'Where is the mud causing a problem?',
    errorText: 'Select a type of place or activity where the mud is coming from',
    redirect: {
      findAddress: constants.routes.MUD_FIND_ADDRESS,
      locationOption: constants.routes.MUD_LOCATION_OPTION
    }
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_LOCATION_HOME,
    header: 'Where are the vermin/pests causing a problem?',
    errorText: 'Select a type of place or activity where the vermin is coming from',
    redirect: {
      findAddress: constants.routes.VERMIN_FIND_ADDRESS,
      locationOption: constants.routes.VERMIN_LOCATION_OPTION
    }
  }
]

describe('RARS Location Home Routes', () => {
  describe.each(problems)('$problem location home', ({ problem, url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin/pests' }
          : {}
        await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      })
    })
  })

  describe.each(problems)('$problem location home sad path', ({ url, errorText }) => {
    describe('POST', () => {
      it('Should return error state when no option selected', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(errorText)
      })
    })
  })

  describe.each(problems)('$problem location home redirect', ({ url, redirect }) => {
    describe('POST', () => {
      it('Happy: answer "at home" redirects to find address', async () => {
        const options = { url, payload: { answerId: 3103 } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.findAddress)
      })

      it('Happy: answer "somewhere else" redirects to location option', async () => {
        const options = { url, payload: { answerId: 3104 } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.locationOption)
      })
    })
  })
})
