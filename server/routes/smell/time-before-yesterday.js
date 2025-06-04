import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import moment from 'moment'

const timeRegExp = /^(0?[1-9]|1[012])(:[0-5]?[0-9])(am|pm|AM|PM)$/
const invalidTimeRegExp = /^(0?[1-9]|1[012])(:[6-9][0-9])(am|pm|AM|PM)$/


const handlers = {
  get: async (request, h) => {
    const { dateWordString } = request.yar.get(constants.redisKeys.SMELL_DATE_BEFORE_YESTERDAY)
    return h.view(constants.views.SMELL_TIME_BEFORE_YESTERDAY, {
      dateWordString,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { time } = request.payload
    const { dateString } = request.yar.get(constants.redisKeys.SMELL_DATE_BEFORE_YESTERDAY)

    // validate payload for errors
    const errorSummary = validatePayload(dateString, time)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_TIME_BEFORE_YESTERDAY, {
        errorSummary,
        ...request.payload
      })
    }

    const dateTime = getDateTime(dateString, time)
    request.yar.set(constants.redisKeys.SMELL_TIME_BEFORE_YESTERDAY, time)
    request.yar.set(constants.redisKeys.SMELL_START_DATE_TIME, dateTime.toISOString())
    return h.redirect(constants.routes.SMELL_CURRENT)
  }
}

const validatePayload = (dateString, time) => {
  const errorSummary = getErrorSummary()
  if (!time) {
    errorSummary.errorList.push({
      text: 'Enter a time',
      href: '#time'
    })
  } else if (invalidTimeRegExp.test(time)) {
    errorSummary.errorList.push({
      text: 'Enter a real time, for example 11:35am or 2:35pm',
      href: '#time'
    })
  } else if (!timeRegExp.test(time)) {
    errorSummary.errorList.push({
      text: 'Enter a time using the 12-hour clock, for example 11:35am or 2:35pm',
      href: '#time'
    })
  } else if (!isPastTime(dateString, time)) {
    errorSummary.errorList.push({
      text: 'Enter a time in the past',
      href: '#time'
    })
  } else {
    // do nothing
  }
  return errorSummary
}

const getContext = request => {
  const time = request.yar.get(constants.redisKeys.SMELL_TIME_BEFORE_YESTERDAY)
  return {
    time
  }
}

const getDateTime = (dateString, time) => {
  const timeParts = time.split(':')
  const hour = timeParts[0]
  const minute = timeParts[1].slice(0, -2)
  const period = timeParts[1].slice(-2)
  const dateTimeString = `${dateString} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period.toLowerCase()}`
  const dateTime = moment(dateTimeString, 'YYYY-MM-DD hh:mm a')

  return dateTime
}

const isPastTime = (dateString, time) => {
  const dateTime = getDateTime(dateString, time)
  const maxAgeMinutes = 5
  const isDateTimeInPast = dateTime.isBefore(moment().subtract(maxAgeMinutes, 'minutes'))

  return isDateTimeInPast
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_TIME_BEFORE_YESTERDAY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_TIME_BEFORE_YESTERDAY,
    handler: handlers.post
  }
]
