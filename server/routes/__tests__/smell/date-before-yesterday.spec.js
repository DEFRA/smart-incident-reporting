import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/smell-server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_DATE_BEFORE_YESTERDAY
const header = 'What date did the smell start, on this occasion?'
const currentYear = new Date().getFullYear()
const currentYearString = String(currentYear)
const futureYearString = String(currentYear + 1)

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
      const payload = {
        day: 20,
        month: 4,
        year: currentYear
      }
      const sessionData = {
        'smell/date-before-yesterday': { payload }
      }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('id="date-day" name="date-day" type="text" value="20" inputmode="numeric">')
      expect(response.payload).toContain('id="date-month" name="date-month" type="text" value="4" inputmode="numeric">')
      expect(response.payload).toContain(`id="date-year" name="date-year" type="text" value="${currentYearString}" inputmode="numeric">`)
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid date and redirects to water-pollution/time-before-yesterday', async () => {
      const options = {
        url,
        payload: {
          'date-day': '20',
          'date-month': '4',
          'date-year': currentYearString
        }
      }
      const dateString = `${currentYearString}-04-20`
      const dateWordString = `20 April ${currentYearString}`
      const payload = {
        day: '20',
        month: '4',
        year: currentYearString
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.SMELL_TIME_BEFORE_YESTERDAY)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DATE_BEFORE_YESTERDAY)).toEqual({ dateString, dateWordString, payload })
    })
    it('Sad: errors on no fields provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a date')
    })
    it('Sad: error on missing date', async () => {
      const options = {
        url,
        payload: {
          'date-day': '',
          'date-month': '4',
          'date-year': currentYearString
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a day')
    })
    it('Sad: error on missing month', async () => {
      const options = {
        url,
        payload: {
          'date-day': '20',
          'date-month': '',
          'date-year': currentYearString
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a month')
    })
    it('Sad: error on missing year', async () => {
      const options = {
        url,
        payload: {
          'date-day': '20',
          'date-month': '04',
          'date-year': ''
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a year')
    })
    it('Sad: date must be between 0 and 31', async () => {
      const options = {
        url,
        payload: {
          'date-day': '35',
          'date-month': '4',
          'date-year': currentYearString
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a day from 1 to 31')
    })
    it('Sad: month must be between 1 and 12', async () => {
      const options = {
        url,
        payload: {
          'date-day': '20',
          'date-month': '44',
          'date-year': currentYearString
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a month using numbers 1 to 12')
    })
    it('Sad: year must be valid', async () => {
      const options = {
        url,
        payload: {
          'date-day': '20',
          'date-month': '02',
          'date-year': '3025'
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a full year, for example 2024')
    })
    it('Sad: date must be valid', async () => {
      const options = {
        url,
        payload: {
          'date-day': '31',
          'date-month': '02',
          'date-year': currentYearString
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('The date entered must be a real date')
    })
    it('Sad: date must be in past', async () => {
      const options = {
        url,
        payload: {
          'date-day': '20',
          'date-month': '04',
          'date-year': futureYearString
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must be today or in the past year')
    })
  })
})
