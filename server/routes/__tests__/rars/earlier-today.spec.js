import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import moment from 'moment'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_EARLIER_TODAY,
    redirectWhenWorse: constants.routes.SMELL_SMELL_STRENGTH
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_EARLIER_TODAY,
    redirectWhenWorse: constants.routes.NOISE_WHEN_WORSE
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_EARLIER_TODAY,
    redirectWhenWorse: constants.routes.DUST_WHEN_WORSE
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_EARLIER_TODAY,
    redirectWhenWorse: constants.routes.LITTER_WHEN_WORSE
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_EARLIER_TODAY,
    redirectWhenWorse: constants.routes.MUD_WHEN_WORSE
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_EARLIER_TODAY,
    redirectEffectOnDailyLife: constants.routes.VERMIN_EFFECT_ON_DAILY_LIFE
  }
]

const getDateTime = (time) => {
  const date = new Date()
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()
  const timeParts = time.split(':')
  const hour = timeParts[0]
  const minute = timeParts[1].slice(0, -2)
  const period = timeParts[1].slice(-2)
  const dateTimeString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period.toLowerCase()}`
  const dateTime = moment(dateTimeString, 'YYYY-MM-DD hh:mm a')
  return dateTime
}

describe('RARS Earlier Today Routes', () => {
  describe.each(problems)('$problem earlier-today', ({
    url,
    redirectWhenWorse,
    redirectEffectOnDailyLife
  }) => {
    const header = 'What time earlier today?'
    const pastTime = moment().subtract(15, 'm').format('h:mma')
    const pastTimeCaps = moment().subtract(15, 'm').format('hh:mmA')
    const futureTime = moment().add(15, 'm').format('hh:mma')

    describe('GET', () => {
      it('Should return success response with correct view', async () => {
        await submitGetRequest({ url }, header)
      })

      it('Should return success response with prefilled data', async () => {
        const sessionData = {
          'rars/earlier-today': '12:30am'
        }
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('value="12:30am"')
      })
    })

    describe('POST', () => {
      it('Should accept valid time and redirect to the next page', async () => {
        const time = pastTime
        const dateTime = getDateTime(time)
        const response = await submitPostRequest({ url, payload: { time } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectWhenWorse ?? redirectEffectOnDailyLife)
        expect(response.request.yar.get(constants.redisKeys.RARS_EARLIER_TODAY)).toEqual(pastTime)
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN)).toEqual(dateTime.toISOString())
      })

      it('Should accept valid time with caps period and redirect to the next page', async () => {
        const time = pastTimeCaps
        const dateTime = getDateTime(time)
        const response = await submitPostRequest({ url, payload: { time } })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectWhenWorse ?? redirectEffectOnDailyLife)
        expect(response.request.yar.get(constants.redisKeys.RARS_EARLIER_TODAY)).toEqual(pastTime)
        expect(response.request.yar.get(constants.redisKeys.RARS_WHEN)).toEqual(dateTime.toISOString())
      })

      it('Should error when no time provided', async () => {
        const response = await submitPostRequest({ url, payload: { time: '' } }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a time')
      })

      it('Should error when invalid time format', async () => {
        const response = await submitPostRequest({ url, payload: { time: 'invalid' } }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a real time')
      })

      it('Should error when minutes out of range', async () => {
        const response = await submitPostRequest({ url, payload: { time: '10:75am' } }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a real time')
      })

      it('Should error when future time provided', async () => {
        const response = await submitPostRequest({ url, payload: { time: futureTime } }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a time in the past')
      })
    })
  })
})
