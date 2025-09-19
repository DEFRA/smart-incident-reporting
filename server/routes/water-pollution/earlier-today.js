import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { formatTime } from '../../utils/time-helpers.js'
import moment from 'moment'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_EARLIER_TODAY, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    const { time } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(time)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_EARLIER_TODAY, {
        errorSummary,
        ...request.payload
      })
    }

    const formattedTime = formatTime(time)
    const dateTime = getDateTime(formattedTime)
    request.yar.set(constants.redisKeys.WATER_POLLUTION_EARLIER_TODAY, formattedTime)
    request.yar.set(constants.redisKeys.WATER_POLLUTION_WHEN, dateTime.toISOString())
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_POLLUTION_SUBSTANCE)
  }
}

const validatePayload = (time) => {
  const errorSummary = getErrorSummary()
  const formattedTime = formatTime(time)
  if (!time) {
    errorSummary.errorList.push({
      text: 'Enter a time',
      href: '#time'
    })
  } else if (formattedTime === 'INVALID') {
    errorSummary.errorList.push({
      text: 'Enter a real time, for example 11:35am or 2:35pm',
      href: '#time'
    })
  } else if (formattedTime !== 'INVALID' && !isPastTime(formattedTime)) {
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
  const time = request.yar.get(constants.redisKeys.WATER_POLLUTION_EARLIER_TODAY)
  return {
    time
  }
}

const getDateTime = (time) => {
  const minusTwo = -2
  const date = new Date()
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()
  const timeParts = time.split(':')
  const hour = timeParts[0]
  const minute = timeParts[1].slice(0, minusTwo)
  const period = timeParts[1].slice(minusTwo)
  const dateTimeString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period.toLowerCase()}`
  const dateTime = moment(dateTimeString, 'YYYY-MM-DD hh:mm a')

  return dateTime
}

const isPastTime = (time) => {
  const dateTime = getDateTime(time)
  const maxAgeMinutes = 5
  const isDateTimeInPast = dateTime.isBefore(moment().subtract(maxAgeMinutes, 'minutes'))

  return isDateTimeInPast
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_EARLIER_TODAY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_EARLIER_TODAY,
    handler: handlers.post
  }
]
