import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import moment from 'moment'
import { questionSets } from '../../../utils/question-sets.js'

const url = constants.routes.SMELL_DATE_TIME
const header = 'When did the smell start?'

const getOptions = dateTime => {
  return {
    url,
    payload: {
      'date-day': dateTime.format('DD'),
      'date-month': dateTime.format('MM'),
      'date-year': dateTime.format('YYYY'),
      hour: dateTime.format('hh'),
      minute: dateTime.format('mm'),
      period: dateTime.format('a')
    }
  }
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view for ${url} if smell is a recurring problem`, async () => {
      const sessionData = {
        'smell/recurring-problem': [{
          questionId: questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.questionId,
          answerId: questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.answers.yes.answerId
        }]
      }
      await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url} if smell is occasionally`, async () => {
      const sessionData = {
        'smell/recurring-problem': [{
          questionId: questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.questionId,
          answerId: questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.answers.occasionally.answerId
        }]
      }
      await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
    })
    it(`Should return success response and correct view for ${url} with on this occasion in header`, async () => {
      const sessionData = {
        'smell/recurring-problem': [{
          questionId: questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.questionId,
          answerId: questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.answers.no.answerId
        }]
      }
      await submitGetRequest({ url }, 'When did the smell start, on this occasion?', constants.statusCodes.OK, sessionData)
    })
  })

  describe('POST', () => {
    it('Happy: accept a valid date time and continue to SMELL_ONGOING', async () => {
      const dateTime = moment().seconds(0).milliseconds(0).subtract(1, 'days')
      const response = await submitPostRequest(getOptions(dateTime))
      expect(response.headers.location).toEqual(constants.routes.SMELL_ONGOING)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Happy: accept a valid date time and continue to SMELL_ONGOING', async () => {
      const dateTime = moment().seconds(0).milliseconds(0).subtract(1, 'years').add(5, 'minutes')
      const response = await submitPostRequest(getOptions(dateTime))
      expect(response.headers.location).toEqual(constants.routes.SMELL_ONGOING)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Happy: accept a valid date time and continue to SMELL_ONGOING', async () => {
      const dateTime = moment().seconds(0).milliseconds(0).add(3, 'minutes')
      const response = await submitPostRequest(getOptions(dateTime))
      expect(response.headers.location).toEqual(constants.routes.SMELL_ONGOING)
      expect(response.request.yar.get(constants.redisKeys.SMELL_DATE_TIME)).toEqual(dateTime.toISOString())
    })
    it('Sad path: valid datetime must not > 5 minutes into the future', async () => {
      const dateTime = moment().seconds(0).milliseconds(0).add(10, 'minutes')
      const response = await submitPostRequest(getOptions(dateTime), constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must be in the past')
    })
    it('Sad path: valid datetime must not be tomorrow or later', async () => {
      const dateTime = moment().seconds(0).milliseconds(0).add(1, 'days')
      const response = await submitPostRequest(getOptions(dateTime), constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must be today or in the past year')
    })
    it('Sad path: valid datetime must > 1 year old', async () => {
      const dateTime = moment().seconds(0).milliseconds(0).subtract(366, 'days')
      const response = await submitPostRequest(getOptions(dateTime), constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must be in the past year')
    })
    it('Sad path: minutes must be between 0 and 59', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      options.payload.minute = '61'
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include minutes from 0 to 59')
    })
    it('Sad path: hours must be between 1 and 12', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      options.payload.hour = '13'
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include an hour from 1 to 12, for midnight use 12:00am')
    })
    it('Sad path: year must be a full 4 digit year', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      options.payload['date-year'] = '1800'
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a full year, for example 2024')
    })
    it('Sad path: date must be valid eg not 30/02', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      options.payload['date-day'] = '30'
      options.payload['date-month'] = '2'
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('The date entered must be a real date')
    })
    it('Sad path: month must be between 1 and 12', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      options.payload['date-month'] = '13'
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a month using numbers 1 to 12')
    })
    it('Sad path: Day must be between 1 and 31', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      options.payload['date-day'] = '32'
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a day from 1 to 31')
    })
    it('Sad path: Hours must be present', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload.hour
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include an hour from 1 to 12')
    })
    it('Sad path: minutes must be present', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload.minute
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include minutes from 0 to 59')
    })
    it('Sad path: period must be present', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload.period
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include am or pm')
    })
    it('Sad path: year must be present', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload['date-year']
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a year')
    })
    it('Sad path: month must be present', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload['date-month']
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a month')
    })
    it('Sad path: day must be present', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload['date-day']
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include a day')
    })
    it('Sad path: If 2 or more date parts missing', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload['date-day']
      delete options.payload['date-month']
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Date must include day, month and year')
    })
    it('Sad path: If 2 or more time parts missing', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload.hour
      delete options.payload.minute
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include hours, minutes and am or pm, for example 2:25pm')
    })
    it('Sad path: If 2 or more time and date parts missing', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload.hour
      delete options.payload.minute
      delete options.payload['date-day']
      delete options.payload['date-month']
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include hours, minutes and am or pm, for example 2:25pm')
      expect(response.payload).toContain('Date must include day, month and year')
    })
    it('Sad path: If 2 or more date and 1 time parts missing', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload.hour
      delete options.payload['date-day']
      delete options.payload['date-month']
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include an hour from 1 to 12')
      expect(response.payload).toContain('Date must include day, month and year')
    })
    it('Sad path: If 2 or more time and 1 date parts missing', async () => {
      const dateTime = moment().seconds(0).milliseconds(0)
      const options = getOptions(dateTime)
      delete options.payload.hour
      delete options.payload.minute
      delete options.payload['date-month']
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Time must include hours, minutes and am or pm, for example 2:25pm')
      expect(response.payload).toContain('Date must include a month')
    })
  })
})
