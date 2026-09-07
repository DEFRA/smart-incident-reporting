import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const problems = [
  {
    problem: 'noise',
    url: constants.routes.NOISE_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.NOISE_DAYS_WHEN_WORSE,
    expectedQuestion: 'Do you notice the noise is worse on certain days or a particular time'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.DUST_DAYS_WHEN_WORSE,
    expectedQuestion: 'Do you notice the dust is worse on certain days or a particular time'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.LITTER_DAYS_WHEN_WORSE,
    expectedQuestion: 'Do you notice the litter is worse on certain days or a particular time'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_WHEN_WORSE,
    redirectDaysWhenWorse: constants.routes.MUD_DAYS_WHEN_WORSE,
    expectedQuestion: 'Do you notice the mud is worse on certain days or a particular time'
  }
]

describe('RARS When Worse Routes', () => {
  describe.each(problems)('$problem when-worse', ({
    url,
    redirectDaysWhenWorse,
    expectedQuestion,
    problem
  }) => {
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

      it('Should store answer and redirect to days-when-worse when option 2 (No) selected', async () => {
        const response = await submitPostRequest({ url, payload: { answerId: String(questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE.answers.no.answerId) } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectDaysWhenWorse)
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN_WORSE)).toBe(questionSets.REPORT_REGULATED_SITE.questions.RARS_WHEN_WORSE.answers.no.answerId)
      })
    })
  })
})
