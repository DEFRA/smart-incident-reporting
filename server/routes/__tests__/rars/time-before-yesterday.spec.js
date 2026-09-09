import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import moment from 'moment'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_TIME_BEFORE_YESTERDAY,
    redirectWhenWorse: constants.routes.SMELL_SMELL_STRENGTH
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_TIME_BEFORE_YESTERDAY,
    redirectWhenWorse: constants.routes.NOISE_WHEN_WORSE
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_TIME_BEFORE_YESTERDAY,
    redirectWhenWorse: constants.routes.DUST_WHEN_WORSE
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_TIME_BEFORE_YESTERDAY,
    redirectWhenWorse: constants.routes.LITTER_WHEN_WORSE
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_TIME_BEFORE_YESTERDAY,
    redirectWhenWorse: constants.routes.MUD_WHEN_WORSE
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_TIME_BEFORE_YESTERDAY,
    redirectEffectOnDailyLife: constants.routes.RARS_EFFECT_ON_DAILY_LIFE
  }
]

const getDateTime = (date, time) => {
  const timeParts = time.split(':')
  const hour = timeParts[0]
  const minute = timeParts[1].slice(0, -2)
  const period = timeParts[1].slice(-2)
  const dateTimeString = `${date} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period.toLowerCase()}`
  const dateTime = moment(dateTimeString, 'YYYY-MM-DD hh:mm a')
  return dateTime
}

describe('RARS Time Before Yesterday Routes', () => {
  it('Should redirect to the when-worse page when configured for the shared RARS flow', async () => {
    const route = require('../../rars/time-before-yesterday.js').default({
      _problem: 'noise',
      route: constants.routes.NOISE_TIME_BEFORE_YESTERDAY,
      redirect: {
        whenWorse: constants.routes.NOISE_WHEN_WORSE,
        smellStrength: constants.routes.SMELL_SMELL_STRENGTH,
        effectOnDailyLife: constants.routes.RARS_EFFECT_ON_DAILY_LIFE
      }
    })

    const response = await route[1].handler({
      payload: { time: '9:30am' },
      yar: {
        get: key => {
          if (key === constants.redisKeys.RARS_DATE_BEFORE_YESTERDAY) {
            return { dateString: '2025-04-20', dateWordString: '20 April 2025' }
          }
          return undefined
        },
        set: jest.fn()
      }
    }, { redirect: jest.fn((url) => url) })

    expect(response).toBe(constants.routes.NOISE_WHEN_WORSE)
  })

  describe.each(problems)('$problem time-before-yesterday', ({
    url,
    redirectWhenWorse,
    redirectEffectOnDailyLife
  }) => {
    const dateString = '2025-04-20'
    const dateWordString = '20 April 2025'
    const header = 'What time on 20 April 2025?'

    describe('GET', () => {
      it('Should return success response with correct view', async () => {
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      })

      it('Should return success response with prefilled data', async () => {
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString },
          'rars/time-before-yesterday': '9:30am'
        }
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('value="9:30am"')
      })
    })

    describe('POST', () => {
      it('Should accept valid time and redirect to the next page', async () => {
        const time = '9:30am'
        const dateTime = getDateTime(dateString, time)
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        const response = await submitPostRequest({ url, payload: { time } }, 302, sessionData)
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectWhenWorse ?? redirectEffectOnDailyLife)
        expect(response.request.yar.get(constants.redisKeys.RARS_TIME_BEFORE_YESTERDAY)).toEqual('9:30am')
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN)).toEqual(dateTime.toISOString())
      })

      it('Should accept valid time with single digit minutes and redirect to the next page', async () => {
        const time = '1:5am'
        const dateTime = getDateTime(dateString, time)
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        const response = await submitPostRequest({ url, payload: { time } }, 302, sessionData)
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectWhenWorse ?? redirectEffectOnDailyLife)
        expect(response.request.yar.get(constants.redisKeys.RARS_TIME_BEFORE_YESTERDAY)).toEqual('1:05am')
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN)).toEqual(dateTime.toISOString())
      })

      it('Should accept valid time with all caps period and redirect to the next page', async () => {
        const time = '12:30AM'
        const dateTime = getDateTime(dateString, time)
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        const response = await submitPostRequest({ url, payload: { time } }, 302, sessionData)
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectWhenWorse ?? redirectEffectOnDailyLife)
        expect(response.request.yar.get(constants.redisKeys.RARS_TIME_BEFORE_YESTERDAY)).toEqual('12:30am')
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN)).toEqual(dateTime.toISOString())
      })

      it('Should error when no time provided', async () => {
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        const response = await submitPostRequest({ url, payload: { time: '' } }, 200, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a time')
      })

      it('Should error when invalid time format', async () => {
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        const response = await submitPostRequest({ url, payload: { time: 'invalid' } }, 200, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a real time')
      })

      it('Should error when minutes out of range', async () => {
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        const response = await submitPostRequest({ url, payload: { time: '10:75am' } }, 200, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a real time')
      })

      it('Should error when the time is in the future', async () => {
        const futureTime = '9:30am'
        const sessionData = {
          'rars/date-before-yesterday': { dateString, dateWordString }
        }
        const response = await submitPostRequest({ url, payload: { time: futureTime } }, 200, sessionData)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a time in the past')
      })
    })
  })
})
