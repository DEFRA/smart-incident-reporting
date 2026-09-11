import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_DAYS_WHEN_WORSE

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const journeys = [
  {
    problem: 'noise',
    url: constants.routes.NOISE_DAYS_WHEN_WORSE,
    next: constants.routes.NOISE_TIMES_WHEN_WORSE,
    heading: 'On which days of the week do you hear the noise?',
    error: 'Select the days of the week you heard the noise?'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_DAYS_WHEN_WORSE,
    next: constants.routes.DUST_TIMES_WHEN_WORSE,
    heading: 'On which days of the week do you notice the dust?',
    error: 'Select the days of the week you noticed the dust?'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_DAYS_WHEN_WORSE,
    next: constants.routes.LITTER_TIMES_WHEN_WORSE,
    heading: 'On which days of the week do you notice the litter?',
    error: 'Select the days of the week you noticed the litter?'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_DAYS_WHEN_WORSE,
    next: constants.routes.MUD_TIMES_WHEN_WORSE,
    heading: 'On which days of the week do you notice the mud?',
    error: 'Select the days of the week you noticed the mud?'
  }
]

describe('RARS days-when-worse', () => {
  describe.each(journeys)('$problem days-when-worse', ({ problem, url, next, heading, error }) => {
    it('Should call createDaysWhenWorseRoutes with the correct config', () => {
      const createDaysWhenWorseRoutes = jest.fn()
      jest.isolateModules(() => {
        jest.doMock('../../rars/days-when-worse.js', () => ({
          __esModule: true,
          default: createDaysWhenWorseRoutes
        }))
        require(`../../${problem}/days-when-worse.js`)
      })

      expect(createDaysWhenWorseRoutes).toHaveBeenCalledTimes(1)
      expect(createDaysWhenWorseRoutes).toHaveBeenCalledWith({
        problem,
        route: url,
        redirect: {
          timesWhenWorse: next
        }
      })
    })

    describe('GET', () => {
      it('Should return success response with the journey specific question', async () => {
        const response = await submitGetRequest({ url }, heading)
        expect(response.payload).toContain(heading)
      })

      it('Should render every day plus the exclusive option', async () => {
        const response = await submitGetRequest({ url }, heading)
        for (const day of allDays) {
          expect(response.payload).toContain(`value="${day}"`)
        }
        expect(response.payload).toContain('value="No particular day"')
        expect(response.payload).toContain('exclusive')
      })

      it('Should pre-check the days already stored in the session', async () => {
        const sessionData = {
          [question.key]: [{
            questionId: question.questionId,
            questionAsked: heading,
            questionResponse: true,
            answerId: question.answers.days.answerId,
            otherDetails: 'Monday;Sunday'
          }]
        }
        const response = await submitGetRequest({ url }, heading, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('value="Monday" checked')
        expect(response.payload).toContain('value="Sunday" checked')
        expect(response.payload).not.toContain('value="Tuesday" checked')
      })
    })

    describe('POST', () => {
      it('Should store the selected days in week order and redirect to times-when-worse', async () => {
        const options = { url, payload: { answerId: ['Sunday', 'Monday', 'Wednesday'] } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)

        expect(response.headers.location).toBe(next)
        expect(response.request.yar.get(question.key)).toEqual([{
          questionId: 1360,
          questionAsked: heading,
          questionResponse: true,
          answerId: 1363,
          otherDetails: 'Monday;Wednesday;Sunday'
        }])
      })

      it('Should store a single selected day submitted as a string', async () => {
        const options = { url, payload: { answerId: 'Friday' } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)

        expect(response.headers.location).toBe(next)
        expect(response.request.yar.get(question.key)[0].otherDetails).toBe('Friday')
      })

      it('Should discard any days submitted alongside the exclusive option', async () => {
        const options = { url, payload: { answerId: ['Monday', 'No particular day'] } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)

        expect(response.headers.location).toBe(next)
        expect(response.request.yar.get(question.key)[0].otherDetails).toBe('No particular day')
      })

      it('Should error when nothing is selected', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK)

        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain(error)
      })

      it('Should error when only unrecognised values are submitted', async () => {
        const options = { url, payload: { answerId: ['Funday'] } }
        const response = await submitPostRequest(options, constants.statusCodes.OK)

        expect(response.payload).toContain(error)
      })
    })
  })
})
