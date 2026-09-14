import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_DATE_BEFORE_YESTERDAY,
    redirectTimeBeforeYesterday: constants.routes.SMELL_TIME_BEFORE_YESTERDAY
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_DATE_BEFORE_YESTERDAY,
    redirectTimeBeforeYesterday: constants.routes.NOISE_TIME_BEFORE_YESTERDAY
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_DATE_BEFORE_YESTERDAY,
    redirectTimeBeforeYesterday: constants.routes.DUST_TIME_BEFORE_YESTERDAY
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_DATE_BEFORE_YESTERDAY,
    redirectTimeBeforeYesterday: constants.routes.LITTER_TIME_BEFORE_YESTERDAY
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_DATE_BEFORE_YESTERDAY,
    redirectTimeBeforeYesterday: constants.routes.MUD_TIME_BEFORE_YESTERDAY
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_DATE_BEFORE_YESTERDAY,
    redirectTimeBeforeYesterday: constants.routes.VERMIN_TIME_BEFORE_YESTERDAY
  }
]

const currentYear = new Date().getFullYear()
const currentYearString = String(currentYear)
const futureYearString = String(currentYear + 1)

describe('RARS Date Before Yesterday Routes', () => {
  describe.each(problems)('$problem date-before-yesterday', ({
    url,
    redirectTimeBeforeYesterday
  }) => {
    const header = 'What date?'

    describe('GET', () => {
      it('Should return success response with correct view', async () => {
        await submitGetRequest({ url }, header)
      })

      it('Should return success response with prefilled data', async () => {
        const payload = {
          day: 20,
          month: 4,
          year: currentYear
        }
        const sessionData = {
          'rars/date-before-yesterday': { payload }
        }
        const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
        expect(response.payload).toContain('id="date-day" name="date-day" type="text" value="20"')
        expect(response.payload).toContain('id="date-month" name="date-month" type="text" value="4"')
        expect(response.payload).toContain(`id="date-year" name="date-year" type="text" value="${currentYearString}"`)
      })
    })

    describe('POST', () => {
      it('Should accept valid date and redirect to time-before-yesterday', async () => {
        const response = await submitPostRequest({
          url,
          payload: {
            'date-day': '20',
            'date-month': '4',
            'date-year': currentYearString
          }
        })
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(redirectTimeBeforeYesterday)
        const storedData = response.request.yar.get(constants.redisKeys.RARS_DATE_BEFORE_YESTERDAY)
        expect(storedData.dateString).toEqual(`${currentYearString}-04-20`)
        expect(storedData.dateWordString).toEqual(`20 April ${currentYearString}`)
      })

      it('Should error when no fields provided', async () => {
        const response = await submitPostRequest({ url, payload: {} }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Enter a date')
      })

      it('Should error when missing day', async () => {
        const response = await submitPostRequest({
          url,
          payload: { 'date-day': '', 'date-month': '4', 'date-year': currentYearString }
        }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Date must include a day')
      })

      it('Should error when missing month', async () => {
        const response = await submitPostRequest({
          url,
          payload: { 'date-day': '20', 'date-month': '', 'date-year': currentYearString }
        }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Date must include a month')
      })

      it('Should error when missing year', async () => {
        const response = await submitPostRequest({
          url,
          payload: { 'date-day': '20', 'date-month': '4', 'date-year': '' }
        }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Date must include a year')
      })

      it('Should error when day out of range', async () => {
        const response = await submitPostRequest({
          url,
          payload: { 'date-day': '35', 'date-month': '4', 'date-year': currentYearString }
        }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Date must include a day from 1 to 31')
      })

      it('Should error when month out of range', async () => {
        const response = await submitPostRequest({
          url,
          payload: { 'date-day': '20', 'date-month': '44', 'date-year': currentYearString }
        }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Date must include a month using numbers 1 to 12')
      })

      it('Should error when year in future', async () => {
        const response = await submitPostRequest({
          url,
          payload: { 'date-day': '20', 'date-month': '4', 'date-year': futureYearString }
        }, 200)
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Date must be today or in the past year')
      })
    })
  })
})
