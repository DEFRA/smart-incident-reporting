import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { formatTime } from '../../utils/time-helpers.js'
import moment from 'moment'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    const { time } = request.payload
    const { dateString } = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_DATE_BEFORE_YESTERDAY)

    // validate payload for errors
    const errorSummary = validatePayload(dateString, time)
    if (errorSummary.errorList.length > 0) {
      const { dateWordString } = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_DATE_BEFORE_YESTERDAY)
      return h.view(constants.views.ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY, {
        errorSummary,
        dateWordString,
        ...request.payload
      })
    }

    const formattedTime = formatTime(time)
    const dateTime = getDateTime(dateString, formattedTime)
    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY, formattedTime)
    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_WHEN, dateTime.toISOString())
    return h.redirect(constants.routes.ILLEGAL_FISHING_PEOPLE_DESCRIPTION)
  }
}

const validatePayload = (dateString, time) => {
  const errorSummary = getErrorSummary()
  const formattedTime = formatTime(time)
  if (!time) {
    errorSummary.errorList.push({
      text: 'Enter a time',
      href: '#time'
    })
  } else if (formattedTime === 'INVALID_TIME_FORMAT') {
    errorSummary.errorList.push({
      text: 'Enter a real time, for example 11:35am or 2:35pm',
      href: '#time'
    })
  } else if (formattedTime !== 'INVALID_TIME_FORMAT' && !isPastTime(dateString, formattedTime)) {
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
  const time = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY)
  const { dateWordString } = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_DATE_BEFORE_YESTERDAY)
  return {
    time,
    dateWordString
  }
}

const getDateTime = (dateString, time) => {
  const minusTwo = -2
  const timeParts = time.split(':')
  const hour = timeParts[0]
  const minute = timeParts[1].slice(0, minusTwo)
  const period = timeParts[1].slice(minusTwo)
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
    path: constants.routes.ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY,
    handler: handlers.post
  }
]
