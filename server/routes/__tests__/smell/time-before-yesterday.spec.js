import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import moment from 'moment'

const url = constants.routes.SMELL_TIME_BEFORE_YESTERDAY

const getDateTime = (date, time) => {
  const timeParts = time.split(':')
  const hour = timeParts[0]
  const minute = timeParts[1].slice(0, -2)
  const period = timeParts[1].slice(-2)
  const dateTimeString = `${date} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period.toLowerCase()}`
  const dateTime = moment(dateTimeString, 'YYYY-MM-DD hh:mm a')

  return dateTime
}

const header = 'What time on 20 April 2025 did you first notice the smell?'
const dateString = '2025-04-20'
const dateWordString = '20 April 2025'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString }
      }
      await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString },
        'smell/time-before-yesterday': '09:30am'
      }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('value="09:30am"')
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answers and redirects to smell/pollution-substance', async () => {
      const time = '09:30am'
      const dateTime = getDateTime(dateString, time)
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString }
      }
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CURRENT)
      expect(response.request.yar.get(constants.redisKeys.SMELL_TIME_BEFORE_YESTERDAY)).toEqual('09:30am')
      expect(response.request.yar.get(constants.redisKeys.SMELL_START_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Happy: accepts valid answers with single digit time and redirects to smell/pollution-substance', async () => {
      const time = '1:5am'
      const dateTime = getDateTime(dateString, time)
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString }
      }
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CURRENT)
      expect(response.request.yar.get(constants.redisKeys.SMELL_TIME_BEFORE_YESTERDAY)).toEqual('1:5am')
      expect(response.request.yar.get(constants.redisKeys.SMELL_START_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Happy: accepts valid answers with all caps period and redirects to smell/pollution-substance', async () => {
      const time = '12:30AM'
      const dateTime = getDateTime(dateString, time)
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString }
      }
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, sessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CURRENT)
      expect(response.request.yar.get(constants.redisKeys.SMELL_TIME_BEFORE_YESTERDAY)).toEqual('12:30AM')
      expect(response.request.yar.get(constants.redisKeys.SMELL_START_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Sad: errors on no fields provided', async () => {
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString }
      }
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a time')
    })
    it('Sad: error on invalid time', async () => {
      const time = 'Test'
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString }
      }
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a time using the 12-hour clock, for example 11:35am or 2:35pm')
    })
    it('Sad: minutes must be between 0 and 59', async () => {
      const time = '10:75am'
      const sessionData = {
        'smell/date-before-yesterday': { dateString, dateWordString }
      }
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a real time, for example 11:35am or 2:35pm')
    })
  })
})
