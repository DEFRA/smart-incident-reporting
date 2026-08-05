import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_SOURCE,
    header: 'Where is the smell coming from?',
    errorText: 'Select a type of place or activity where the smell is coming from',
    redirect: {
      contactEnvironmentAgency: constants.routes.SMELL_CONTACT_ENVIRONMENT_AGENCY,
      localCouncil: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
      sourceDetails: constants.routes.SMELL_SOURCE_DETAILS
    }
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_SOURCE,
    header: 'Where is the noise coming from?',
    errorText: 'Select a type of place or activity where the noise is coming from',
    redirect: {
      contactEnvironmentAgency: constants.routes.NOISE_CONTACT_ENVIRONMENT_AGENCY,
      localCouncil: constants.routes.NOISE_REPORT_LOCAL_COUNCIL,
      sourceDetails: constants.routes.NOISE_SOURCE_DETAILS
    }
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_SOURCE,
    header: 'Where is the dust coming from?',
    errorText: 'Select a type of place or activity where the dust is coming from',
    redirect: {
      contactEnvironmentAgency: constants.routes.DUST_CONTACT_ENVIRONMENT_AGENCY,
      localCouncil: constants.routes.DUST_REPORT_LOCAL_COUNCIL,
      sourceDetails: constants.routes.DUST_SOURCE_DETAILS
    }
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_SOURCE,
    header: 'Where is the litter coming from?',
    errorText: 'Select a type of place or activity where the litter is coming from',
    redirect: {
      contactEnvironmentAgency: constants.routes.LITTER_CONTACT_ENVIRONMENT_AGENCY,
      localCouncil: constants.routes.LITTER_REPORT_LOCAL_COUNCIL,
      sourceDetails: constants.routes.LITTER_SOURCE_DETAILS
    }
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_SOURCE,
    header: 'Where is the mud coming from?',
    errorText: 'Select a type of place or activity where the mud is coming from',
    redirect: {
      contactEnvironmentAgency: constants.routes.MUD_CONTACT_ENVIRONMENT_AGENCY,
      localCouncil: constants.routes.MUD_REPORT_LOCAL_COUNCIL,
      sourceDetails: constants.routes.MUD_SOURCE_DETAILS
    }
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_SOURCE,
    header: 'Where is the vermin coming from?',
    errorText: 'Select a type of place or activity where the vermin is coming from',
    redirect: {
      contactEnvironmentAgency: constants.routes.VERMIN_CONTACT_ENVIRONMENT_AGENCY,
      localCouncil: constants.routes.VERMIN_REPORT_LOCAL_COUNCIL,
      sourceDetails: constants.routes.VERMIN_SOURCE_DETAILS
    }
  }
]

describe('RARS Source Routes', () => {
  describe.each(problems)('$problem source', ({ problem, url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin' }
          : {}

        await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
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

  describe.each(problems)('$problem source redirect', ({ url, redirect }) => {
    describe('POST', () => {
      it.each([
        { answerId: 1601 }, { answerId: 1602 }, { answerId: 1603 }, { answerId: 1604 }
      ])('Happy: valid answer redirects too source details', async (answerId) => {
        const options = { url, payload: answerId }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.sourceDetails)
      })

      it.each([
        { answerId: 1605 }, { answerId: 1606 }
      ])('Happy: valid answer redirects too report local council', async (answerId) => {
        const options = { url, payload: answerId }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.localCouncil)
      })

      it('Happy: valid answer redirects too contact environment agency', async () => {
        const options = { url, payload: { answerId: 1608 } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.contactEnvironmentAgency)
      })
    })
  })

  describe('vermin source title behaviour', () => {
    it('Should use selected vermin type in title when session has VERMIN_TYPE_SELECTED', async () => {
      const response = await submitGetRequest(
        { url: constants.routes.VERMIN_SOURCE },
        'Where is the rats coming from?',
        constants.statusCodes.OK,
        { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'rats' }
      )
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })

    it('Should show selected vermin type title when validation fails and session has VERMIN_TYPE_SELECTED', async () => {
      const response = await submitPostRequest(
        { url: constants.routes.VERMIN_SOURCE, payload: {} },
        constants.statusCodes.OK,
        { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'rats' }
      )
      expect(response.payload).toContain('Where is the rats coming from?')
      expect(response.payload).toContain('There is a problem')
    })
  })
})
