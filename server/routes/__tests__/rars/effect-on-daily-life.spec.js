import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE,
    header: 'Did you do any of the following because of the smell, on this occasion?',
    errorText: 'Select any of the following you did because of the smell, or &#39;none of these&#39;',
    redirect: {
      effectOnHealth: constants.routes.SMELL_EFFECT_ON_HEALTH
    }
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE,
    header: 'Did you do any of the following because of the noise, on this occasion?',
    errorText: 'Select any of the following you did because of the noise, or &#39;none of these&#39;',
    redirect: {
      effectOnHealth: constants.routes.NOISE_EFFECT_ON_HEALTH
    }
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_EFFECT_ON_DAILY_LIFE,
    header: 'Did you do any of the following because of the dust, on this occasion?',
    errorText: 'Select any of the following you did because of the dust, or &#39;none of these&#39;',
    redirect: {
      effectOnHealth: constants.routes.DUST_EFFECT_ON_HEALTH
    }
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE,
    header: 'Did you do any of the following because of the litter, on this occasion?',
    errorText: 'Select any of the following you did because of the litter, or &#39;none of these&#39;',
    redirect: {
      effectOnHealth: constants.routes.LITTER_EFFECT_ON_HEALTH
    }
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_EFFECT_ON_DAILY_LIFE,
    header: 'Did you do any of the following because of the mud, on this occasion?',
    errorText: 'Select any of the following you did because of the mud, or &#39;none of these&#39;',
    redirect: {
      effectOnHealth: constants.routes.MUD_EFFECT_ON_HEALTH
    }
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE,
    header: 'Do you know the site or business responsible for the vermin/pests?',
    errorText: 'Select any of the following you did because of the vermin/pests, or &#39;none of these&#39;',
    redirect: {
      effectOnHealth: constants.routes.VERMIN_EFFECT_ON_HEALTH
    }
  }
]

describe('RARS Effect On Daily Life Routes', () => {
  describe.each(problems)('$problem effect on daily life', ({ problem, url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin/pests' }
          : {}

        await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      })
    })
  })

  describe.each(problems)('$problem effect on daily life sad path', ({ url, errorText, problem }) => {
    describe('POST', () => {
      it('Sad: no checkbox selected, returns error state with dynamic error text', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'vermin/pests' }
          : {}
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(errorText)
      })
    })
  })

  it('Sad: vermin with no vermin type selected in session defaults error text to vermin', async () => {
    const options = { url: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE, payload: {} }
    const response = await submitPostRequest(options, constants.statusCodes.OK)
    expect(response.payload).toContain('There is a problem')
    expect(response.payload).toContain('Select any of the following you did because of the vermin, or &#39;none of these&#39;')
  })

  describe.each(problems)('$problem effect on daily life redirect', ({ url, redirect }) => {
    describe('POST', () => {
      it('Happy: single answer (string) redirects to effect on health', async () => {
        const options = { url, payload: { answerId: '2401' } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })

      it('Happy: going elsewhere answer with details redirects to effect on health', async () => {
        const options = {
          url,
          payload: { answerId: ['2404'], putOffDetails: 'Went to the shops later' }
        }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })

      it('Happy: going elsewhere answer without details redirects to effect on health', async () => {
        const options = { url, payload: { answerId: ['2404'] } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })

      it('Happy: cancel event answer with details redirects to effect on health', async () => {
        const options = {
          url,
          payload: { answerId: ['2405'], eventDetails: 'Missed a birthday party' }
        }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })

      it('Happy: cancel event answer without details redirects to effect on health', async () => {
        const options = { url, payload: { answerId: ['2405'] } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })

      it('Happy: something else answer with details redirects to effect on health', async () => {
        const options = {
          url,
          payload: { answerId: ['2406'], somethingElseDetails: 'Something happened' }
        }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })

      it('Happy: something else answer without details redirects to effect on health', async () => {
        const options = { url, payload: { answerId: ['2406'] } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })

      it('Happy: multiple answers including none of these redirects to effect on health', async () => {
        const options = { url, payload: { answerId: ['2401', '2402', '2403', '2407'] } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect.effectOnHealth)
      })
    })
  })

  describe('vermin effect on daily life title behaviour', () => {
    it.each(['rats', 'seagulls', 'vermin/pests'])(
      'Should use selected vermin type in title when session has %s', async (selectedVermin) => {
        const response = await submitGetRequest(
          { url: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE },
          `Do you know the site or business responsible for the ${selectedVermin}?`,
          constants.statusCodes.OK,
          { [constants.redisKeys.VERMIN_TYPE_SELECTED]: selectedVermin }
        )
        expect(response.statusCode).toBe(constants.statusCodes.OK)
      }
    )

    it.each(['rats', 'seagulls', 'vermin/pests'])(
      'Should show selected vermin type title when validation fails and session has %s', async (selectedVermin) => {
        const response = await submitPostRequest(
          { url: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE, payload: {} },
          constants.statusCodes.OK,
          { [constants.redisKeys.VERMIN_TYPE_SELECTED]: selectedVermin }
        )
        expect(response.payload).toContain(`Do you know the site or business responsible for the ${selectedVermin}?`)
        expect(response.payload).toContain('There is a problem')
      }
    )
  })
})
