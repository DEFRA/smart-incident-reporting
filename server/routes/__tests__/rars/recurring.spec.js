import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_RECURRING

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_RECURRING,
    header: 'Has this happened before?',
    redirect: constants.routes.SMELL_WHEN
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_RECURRING,
    header: 'Has this happened before?',
    redirect: constants.routes.NOISE_WHEN
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_RECURRING,
    header: 'Has this happened before?',
    redirect: constants.routes.DUST_WHEN
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_RECURRING,
    header: 'Has this happened before?',
    redirect: constants.routes.LITTER_WHEN
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_RECURRING,
    header: 'Has this happened before?',
    redirect: constants.routes.MUD_WHEN
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_RECURRING,
    header: 'Has this happened before?',
    redirect: constants.routes.VERMIN_WHEN
  }
]

describe('RARS Recurring Routes', () => {
  describe.each(problems)('$problem recurring', ({ problem, url, header }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'rats' }
          : {}

        await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      })
    })
  })

  describe.each(problems)('$problem recurring sad path', ({ problem, url }) => {
    describe('POST', () => {
      it('Sad: no radio selected, returns error state', async () => {
        const sessionData = problem === 'vermin'
          ? { [constants.redisKeys.VERMIN_TYPE_SELECTED]: 'rats' }
          : {}

        const response = await submitPostRequest(
          { url, payload: {} },
          constants.statusCodes.OK,
          sessionData
        )

        expect(response.payload).toContain('There is a problem')
        const expectedProblem = problem === 'vermin' ? 'rats' : problem
        expect(response.payload).toContain(`Select &#39;yes&#39; if the ${expectedProblem} has caused you a problem before`)
      })
    })
  })

  describe.each(problems)('$problem recurring redirect', ({ url, redirect }) => {
    describe('POST', () => {
      it.each([
        { answerId: question.answers.yes.answerId },
        { answerId: question.answers.occasionally.answerId },
        { answerId: question.answers.no.answerId }
      ])('Happy: valid answer redirects to when page', async ({ answerId }) => {
        const options = { url, payload: { answerId } }
        const response = await submitPostRequest(options)
        expect(response.statusCode).toBe(constants.statusCodes.REDIRECT)
        expect(response.headers.location).toBe(redirect)
        expect(response.request.yar.get(constants.redisKeys.RARS_RECURRING)).toEqual([{
          ...baseAnswer,
          answerId
        }])
      })

      it('Happy: converts answerId string to number', async () => {
        const answerId = String(question.answers.yes.answerId)
        const options = { url, payload: { answerId } }
        const response = await submitPostRequest(options)
        const sessionData = response.request.yar.get(constants.redisKeys.RARS_RECURRING)

        expect(typeof sessionData[0].answerId).toBe('number')
        expect(sessionData[0].answerId).toBe(question.answers.yes.answerId)
      })
    })
  })
})
