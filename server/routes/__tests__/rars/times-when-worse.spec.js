import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_TIMES_WHEN_WORSE

const allTimes = ['Morning', 'Afternoon', 'Evening', 'Night']

const journeys = [
  {
    problem: 'noise',
    url: constants.routes.NOISE_TIMES_WHEN_WORSE,
    next: constants.routes.NOISE_EFFECT_ON_DAILY_LIFE,
    heading: 'At which times of day do you hear the noise?',
    error: 'Select the time of the day you heard the noise?'
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_TIMES_WHEN_WORSE,
    next: constants.routes.DUST_EFFECT_ON_DAILY_LIFE,
    heading: 'At which times of day do you notice the dust?',
    error: 'Select the time of the day you noticed the dust?'
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_TIMES_WHEN_WORSE,
    next: constants.routes.LITTER_EFFECT_ON_DAILY_LIFE,
    heading: 'At which times of day do you notice the litter?',
    error: 'Select the time of the day you noticed the litter?'
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_TIMES_WHEN_WORSE,
    next: constants.routes.MUD_EFFECT_ON_DAILY_LIFE,
    heading: 'At which times of day do you notice the mud?',
    error: 'Select the time of the day you noticed the mud?'
  }
]

describe('RARS times-when-worse', () => {
  describe.each(journeys)('$problem times-when-worse', ({ problem, url, next, heading, error }) => {
    it('Should call createTimesWhenWorseRoutes with the correct config', () => {
      const createTimesWhenWorseRoutes = jest.fn()
      jest.isolateModules(() => {
        jest.doMock('../../rars/times-when-worse.js', () => ({
          __esModule: true,
          default: createTimesWhenWorseRoutes
        }))
        require(`../../${problem}/times-when-worse.js`)
      })

      expect(createTimesWhenWorseRoutes).toHaveBeenCalledTimes(1)
      expect(createTimesWhenWorseRoutes).toHaveBeenCalledWith({
        problem,
        route: url,
        redirect: {
          effectOnDailyLife: next
        }
      })
    })

    describe('GET', () => {
      it('Should return success response with the journey specific question', async () => {
        const response = await submitGetRequest({ url }, heading)
        expect(response.payload).toContain(heading)
      })

      it('Should render every time of day plus the exclusive option', async () => {
        const response = await submitGetRequest({ url }, heading)
        for (const time of allTimes) {
          expect(response.payload).toContain(`value="${time}"`)
        }
        expect(response.payload).toContain('value="No particular day"')
        expect(response.payload).toContain('exclusive')
      })

      it('Should pre-check the times already stored in the session', async () => {
        const sessionData = {
          [question.key]: [{
            questionId: question.questionId,
            questionAsked: heading,
            questionResponse: true,
            answerId: question.answers.times.answerId,
            otherDetails: 'Morning;Night'
          }]
        }
        const response = await submitGetRequest({ url }, heading, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('value="Morning" checked')
        expect(response.payload).toContain('value="Night" checked')
        expect(response.payload).not.toContain('value="Afternoon" checked')
      })
    })

    describe('POST', () => {
      it('Should store the selected times in order and redirect to effect-on-daily-life', async () => {
        const options = { url, payload: { answerId: ['Night', 'Morning', 'Afternoon'] } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)

        expect(response.headers.location).toBe(next)
        expect(response.request.yar.get(question.key)).toEqual([{
          questionId: 1370,
          questionAsked: heading,
          questionResponse: true,
          answerId: 1371,
          otherDetails: 'Morning;Afternoon;Night'
        }])
      })

      it('Should store a single selected time submitted as a string', async () => {
        const options = { url, payload: { answerId: 'Evening' } }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)

        expect(response.headers.location).toBe(next)
        expect(response.request.yar.get(question.key)[0].otherDetails).toBe('Evening')
      })

      it('Should discard any times submitted alongside the exclusive option', async () => {
        const options = { url, payload: { answerId: ['Morning', 'No particular day'] } }
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
        const options = { url, payload: { answerId: ['Midnight'] } }
        const response = await submitPostRequest(options, constants.statusCodes.OK)

        expect(response.payload).toContain(error)
      })
    })
  })
})
