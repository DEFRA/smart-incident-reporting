import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import createWhenRoutes from '../../rars/when.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_WHEN,
    redirectLocationDescription: constants.routes.SMELL_LOCATION_DESCRIPTION,
    redirectEarlierToday: constants.routes.SMELL_EARLIER_TODAY,
    redirectYesterday: constants.routes.SMELL_YESTERDAY,
    redirectDateBeforeYesterday: constants.routes.SMELL_DATE_BEFORE_YESTERDAY,
    expectedQuestion: 'When did you most recently notice the smell',
    expectedError: 'Select when you noticed the smell'
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_WHEN,
    redirectLocationDescription: constants.routes.NOISE_LOCATION_DESCRIPTION,
    redirectEarlierToday: constants.routes.NOISE_EARLIER_TODAY,
    redirectYesterday: constants.routes.NOISE_YESTERDAY,
    redirectDateBeforeYesterday: constants.routes.NOISE_DATE_BEFORE_YESTERDAY,
    expectedQuestion: 'When did you most recently hear the noise',
    expectedError: 'Select when you heard the noise'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_WHEN,
    redirectLocationDescription: constants.routes.DUST_LOCATION_DESCRIPTION,
    redirectEarlierToday: constants.routes.DUST_EARLIER_TODAY,
    redirectYesterday: constants.routes.DUST_YESTERDAY,
    redirectDateBeforeYesterday: constants.routes.DUST_DATE_BEFORE_YESTERDAY,
    expectedQuestion: 'When did you most recently notice the dust',
    expectedError: 'Select when you noticed the dust'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_WHEN,
    redirectLocationDescription: constants.routes.LITTER_LOCATION_DESCRIPTION,
    redirectEarlierToday: constants.routes.LITTER_EARLIER_TODAY,
    redirectYesterday: constants.routes.LITTER_YESTERDAY,
    redirectDateBeforeYesterday: constants.routes.LITTER_DATE_BEFORE_YESTERDAY,
    expectedQuestion: 'When did you most recently notice the litter',
    expectedError: 'Select when you noticed the litter'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_WHEN,
    redirectLocationDescription: constants.routes.MUD_LOCATION_DESCRIPTION,
    redirectEarlierToday: constants.routes.MUD_EARLIER_TODAY,
    redirectYesterday: constants.routes.MUD_YESTERDAY,
    redirectDateBeforeYesterday: constants.routes.MUD_DATE_BEFORE_YESTERDAY,
    expectedQuestion: 'When did you most recently notice the mud',
    expectedError: 'Select when you noticed the mud'
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_WHEN,
    redirectLocationDescription: constants.routes.VERMIN_LOCATION_DESCRIPTION,
    redirectEarlierToday: constants.routes.VERMIN_EARLIER_TODAY,
    redirectYesterday: constants.routes.VERMIN_YESTERDAY,
    redirectDateBeforeYesterday: constants.routes.VERMIN_DATE_BEFORE_YESTERDAY,
    redirectEffectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE,
    expectedQuestion: 'When did you most recently notice the vermin/pests',
    expectedError: 'Select when you noticed the vermin/pests'
  }
]

describe('RARS When Routes', () => {
  it('Should redirect to dateBeforeYesterday when option 4 is selected', async () => {
    const route = createWhenRoutes({
      problem: 'smell',
      route: constants.routes.SMELL_WHEN,
      redirect: {
        whenWorse: constants.routes.SMELL_SMELL_STRENGTH,
        earlierToday: constants.routes.SMELL_EARLIER_TODAY,
        yesterday: constants.routes.SMELL_YESTERDAY,
        dateBeforeYesterday: constants.routes.SMELL_DATE_BEFORE_YESTERDAY
      }
    })

    const request = {
      payload: { answerId: '4' },
      yar: {
        get: jest.fn(() => undefined),
        set: jest.fn()
      }
    }
    const h = {
      redirect: jest.fn(() => 'redirected')
    }

    const response = await route[1].handler(request, h)

    expect(response).toBe('redirected')
    expect(h.redirect).toHaveBeenCalledWith(constants.routes.SMELL_DATE_BEFORE_YESTERDAY)
    expect(request.yar.set).toHaveBeenCalledWith(constants.redisKeys.DATE_TIME_OPTION, 4)
  })

  it('Should return null for an unhandled option value', async () => {
    const route = createWhenRoutes({
      problem: 'noise',
      route: constants.routes.NOISE_WHEN,
      redirect: {
        whenWorse: constants.routes.NOISE_WHEN_WORSE,
        earlierToday: constants.routes.NOISE_EARLIER_TODAY,
        yesterday: constants.routes.NOISE_YESTERDAY,
        dateBeforeYesterday: constants.routes.NOISE_DATE_BEFORE_YESTERDAY
      }
    })

    const request = {
      payload: { answerId: '99' },
      yar: {
        get: jest.fn(() => undefined),
        set: jest.fn()
      }
    }
    const h = {
      redirect: jest.fn()
    }

    const response = await route[1].handler(request, h)

    expect(response).toBeNull()
    expect(h.redirect).not.toHaveBeenCalled()
    expect(request.yar.set).toHaveBeenCalledWith(constants.redisKeys.DATE_TIME_OPTION, 99)
  })

  it('Should surface the vermin-specific validation copy when the answer is missing', async () => {
    const route = createWhenRoutes({
      problem: 'vermin',
      route: constants.routes.VERMIN_WHEN,
      redirect: {
        whenWorse: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE,
        earlierToday: constants.routes.VERMIN_EARLIER_TODAY,
        yesterday: constants.routes.VERMIN_YESTERDAY,
        dateBeforeYesterday: constants.routes.VERMIN_DATE_BEFORE_YESTERDAY
      }
    })

    const request = {
      payload: {},
      yar: {
        get: jest.fn(() => undefined),
        set: jest.fn()
      }
    }
    const h = {
      view: jest.fn((viewName, viewData) => ({ viewName, viewData }))
    }

    const response = await route[1].handler(request, h)

    expect(h.view).toHaveBeenCalledWith(
      constants.views.RARS_WHEN,
      expect.objectContaining({
        problem: 'vermin',
        errorSummary: expect.objectContaining({
          errorList: [expect.objectContaining({
            text: 'Select when you noticed the vermin/pests',
            href: '#answerId'
          })]
        })
      })
    )
    expect(response.viewData.errorSummary.errorList[0].text).toBe('Select when you noticed the vermin/pests')
  })

  describe.each(problems)('$problem when', ({
    url,
    redirectEarlierToday,
    redirectYesterday,
    redirectDateBeforeYesterday,
    redirectEffectOnDailyLife,
    expectedQuestion,
    expectedError,
    problem
  }) => {
    const redirectWorseMap = {
      smell: constants.routes.SMELL_SMELL_STRENGTH,
      noise: constants.routes.NOISE_WHEN_WORSE,
      dust: constants.routes.DUST_WHEN_WORSE,
      litter: constants.routes.LITTER_WHEN_WORSE,
      mud: constants.routes.MUD_WHEN_WORSE,
      vermin: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE
    }
    const redirectWorse = redirectWorseMap[problem]

    describe('GET', () => {
      it('Should return success response with incident-specific question', async () => {
        const response = await submitGetRequest({ url }, expectedQuestion)
        expect(response.payload).toContain(expectedQuestion)
      })
    })

    describe('POST', () => {
      it('Should return error when answerId is missing', async () => {
        const response = await submitPostRequest(
          { url, payload: {} },
          constants.statusCodes.OK
        )
        expect(response.payload).toContain(expectedError)
        expect(response.payload).toContain('href="#answerId"')
      })

      it('Should store selected option and redirect to the next page when option 1 (Now) selected', async () => {
        const response = await submitPostRequest({ url, payload: { answerId: '1' } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectWorse ?? redirectEffectOnDailyLife)
        expect(response.request.yar.get(constants.redisKeys.DATE_TIME_OPTION)).toBe(1)
        expect(new Date(response.request.yar.get(constants.redisKeys.RARS_WHEN))).toBeInstanceOf(Date)
      })

      it('Should store selected option and redirect to earlierToday when option 2 selected', async () => {
        const response = await submitPostRequest({ url, payload: { answerId: '2' } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectEarlierToday)
        expect(response.request.yar.get(constants.redisKeys.DATE_TIME_OPTION)).toBe(2)
      })

      it('Should store selected option and redirect to yesterday when option 3 selected', async () => {
        const response = await submitPostRequest({ url, payload: { answerId: '3' } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectYesterday)
        expect(response.request.yar.get(constants.redisKeys.DATE_TIME_OPTION)).toBe(3)
      })

      it('Should store selected option and redirect to dateBeforeYesterday when option 4 selected', async () => {
        const response = await submitPostRequest({ url, payload: { answerId: '4' } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectDateBeforeYesterday)
        expect(response.request.yar.get(constants.redisKeys.DATE_TIME_OPTION)).toBe(4)
      })
    })
  })
})
