import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_SOURCE,
    header: 'Where is the smell coming from?',
    errorText: 'Select a type of place or activity where the smell is coming from',
    redirectUrl: constants.routes.SMELL_SOURCE
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_SOURCE,
    header: 'Where is the noise coming from?',
    errorText: 'Select a type of place or activity where the noise is coming from',
    redirectUrl: constants.routes.NOISE_SOURCE
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_SOURCE,
    header: 'Where is the dust coming from?',
    errorText: 'Select a type of place or activity where the dust is coming from',
    redirectUrl: constants.routes.DUST_SOURCE
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_SOURCE,
    header: 'Where is the litter coming from?',
    errorText: 'Select a type of place or activity where the litter is coming from',
    redirectUrl: constants.routes.LITTER_SOURCE
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_SOURCE,
    header: 'Where is the mud coming from?',
    errorText: 'Select a type of place or activity where the mud is coming from',
    redirectUrl: constants.routes.MUD_SOURCE
  }
]

describe('RARS Source Routes', () => {
  describe.each(problems)('$problem source', ({ url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, header)
      })
    })
  })

  describe.each(problems)('$problem source sad path', ({ url, errorText }) => {
    describe('POST', () => {
      it('Sad: no radio selected, returns error state with dynamic error text', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(errorText)
      })
    })
  })

  describe.each(problems)('$problem source redirect', ({ url, redirectUrl }) => {
    describe('POST', () => {
      it('Happy: valid answer redirects to correct page', async () => {
        const options = { url, payload: { answerId: 'waste-site' } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
      })
    })
  })
})
