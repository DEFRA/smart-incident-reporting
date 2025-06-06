import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import moment from 'moment'

const url = constants.routes.SMELL_EARLIER_TODAY
const header = 'What time today did you first notice the smell?'

const pastTime = moment().subtract(15, 'm').format('hh:mma')
const pastTimeCaps = moment().subtract(15, 'm').format('hh:mmA')
const futureTime = moment().add(15, 'm').format('hh:mma')

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

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view with prefilled data for ${url}`, async () => {
      const sessionData = {
        'smell/earlier-today': '12:30am'
      }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('value="12:30am"')
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answers and redirects to smell/current', async () => {
      const time = pastTime
      const dateTime = getDateTime(time)
      const sessionData = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(sessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CURRENT)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EARLIER_TODAY)).toEqual(pastTime)
      expect(response.request.yar.get(constants.redisKeys.SMELL_START_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Happy: accepts valid answers with all caps period and redirects to smell/pollution-substance', async () => {
      const time = pastTimeCaps
      const dateTime = getDateTime(time)
      const sessionData = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(sessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CURRENT)
      expect(response.request.yar.get(constants.redisKeys.SMELL_EARLIER_TODAY)).toEqual(pastTimeCaps)
      expect(response.request.yar.get(constants.redisKeys.SMELL_START_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Sad: errors on no fields provided', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a time')
    })
    it('Sad: error on invalid time', async () => {
      const time = 'Test'
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a time using the 12-hour clock, for example 11:35am or 2:35pm')
    })
    it('Sad: minutes must be between 0 and 59', async () => {
      const time = '10:75am'
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a real time, for example 11:35am or 2:35pm')
    })
    it('Sad: valid datetime must not > 5 minutes into the future', async () => {
      const time = futureTime
      const options = {
        url,
        payload: {
          time
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Enter a time in the past')
    })
  })
})
