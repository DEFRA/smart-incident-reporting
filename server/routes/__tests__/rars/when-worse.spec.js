import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'
import createWhenWorseRoutes from '../../rars/when-worse.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE

const problems = [
  {
    problem: 'noise',
    url: constants.routes.NOISE_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.NOISE_DAYS_WHEN_WORSE,
    redirectEffectOnDailyLife: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE,
    expectedQuestion: 'Do you notice the noise is worse on certain days or a particular time'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.DUST_DAYS_WHEN_WORSE,
    redirectEffectOnDailyLife: constants.routes.DUST_EFFECT_ON_DAILY_LIFE,
    expectedQuestion: 'Do you notice the dust is worse on certain days or a particular time'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.LITTER_DAYS_WHEN_WORSE,
    redirectEffectOnDailyLife: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE,
    expectedQuestion: 'Do you notice the litter is worse on certain days or a particular time'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.MUD_DAYS_WHEN_WORSE,
    redirectEffectOnDailyLife: constants.routes.MUD_EFFECT_ON_DAILY_LIFE,
    expectedQuestion: 'Do you notice the mud is worse on certain days or a particular time'
  }
]

describe('RARS When Worse Routes', () => {
  it('Should redirect to effect-on-daily-life when the journey has no days-when-worse page', async () => {
    const route = createWhenWorseRoutes({
      problem: 'vermin',
      route: constants.routes.VERMIN_WHEN_WORSE,
      redirect: {
        effectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE
      }
    })

    const request = {
      payload: { answerId: '1' },
      yar: {
        get: jest.fn(() => undefined),
        set: jest.fn()
      }
    }
    const h = { redirect: jest.fn(url => url) }

    const response = await route[1].handler(request, h)

    expect(request.yar.set).toHaveBeenCalledWith(constants.redisKeys.RARS_WHEN_WORSE, 1)
    expect(response).toBe(constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE)
  })

  it('Should surface the vermin-specific validation copy when the answer is missing', async () => {
    const route = createWhenWorseRoutes({
      problem: 'vermin',
      route: constants.routes.VERMIN_WHEN_WORSE,
      redirect: {
        daysWhenWorse: constants.routes.RARS_DAYS_WHEN_WORSE
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
      constants.views.RARS_WHEN_WORSE,
      expect.objectContaining({
        errorSummary: expect.objectContaining({
          errorList: [expect.objectContaining({
            text: 'Select if the vermin/pests is worse on certain days',
            href: '#answerId'
          })]
        })
      })
    )
    expect(response.viewData.errorSummary.errorList[0].text).toBe('Select if the vermin/pests is worse on certain days')
  })

  describe.each(problems)('$problem when-worse', ({
    url,
    redirectDaysWhenWorse,
    redirectEffectOnDailyLife,
    expectedQuestion,
    problem
  }) => {
    describe('GET', () => {
      it('Should return success response with incident-specific question', async () => {
        const response = await submitGetRequest({ url }, expectedQuestion)
        expect(response.payload).toContain(expectedQuestion)
      })

      it('Should render the radio values from the question set', async () => {
        const response = await submitGetRequest({ url }, expectedQuestion)
        expect(response.payload).toContain(`value="${question.answers.yes.answerId}"`)
        expect(response.payload).toContain(`value="${question.answers.no.answerId}"`)
      })

      it('Should pre-check the answer already stored in the session', async () => {
        const sessionData = { [question.key]: question.answers.no.answerId }
        const response = await submitGetRequest({ url }, expectedQuestion, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain(`value="${question.answers.no.answerId}" checked`)
        expect(response.payload).not.toContain(`value="${question.answers.yes.answerId}" checked`)
      })
    })

    describe('POST', () => {
      it('Should return error when answerId is missing', async () => {
        const response = await submitPostRequest(
          { url, payload: {} },
          constants.statusCodes.OK
        )
        const expectedError = problem === 'noise'
          ? 'Select if the noise is worse on certain days'
          : problem === 'vermin'
            ? 'Select if the vermin/pests is worse on certain days'
            : `Select if the ${problem} is worse on certain days`

        expect(response.payload).toContain(expectedError)
        expect(response.payload).toContain('href="#answerId"')
      })

      it('Should store answer and redirect to days-when-worse when option 1 (Yes) selected', async () => {
        const response = await submitPostRequest({ url, payload: { answerId: String(questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE.answers.yes.answerId) } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectDaysWhenWorse)
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN_WORSE)).toBe(questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE.answers.yes.answerId)
      })

      it('Should store answer and redirect to effect-on-daily-life when option 2 (No) selected', async () => {
        const response = await submitPostRequest({ url, payload: { answerId: String(questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE.answers.no.answerId) } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectEffectOnDailyLife)
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN_WORSE)).toBe(questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE.answers.no.answerId)
      })
    })
  })

  // smell has no when-worse page, so the route must not exist
  it('Should not register /smell/when-worse', async () => {
    await submitGetRequest({ url: '/smell/when-worse' }, undefined, constants.statusCodes.PAGE_NOT_FOUND)
  })
})
