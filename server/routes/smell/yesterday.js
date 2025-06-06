import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import moment from 'moment'

const timeRegExp = /^(0?[1-9]|1[012])(:[0-5]?[\d])(am|pm|AM|PM)$/
const invalidTimeRegExp = /^(0?[1-9]|1[012])(:[6-9][\d])(am|pm|AM|PM)$/

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_YESTERDAY, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    const { time } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(time)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_YESTERDAY, {
        errorSummary,
        ...request.payload
      })
    }

    const dateTime = getDateTime(time)
    request.yar.set(constants.redisKeys.SMELL_YESTERDAY, time)
    request.yar.set(constants.redisKeys.SMELL_START_DATE_TIME, dateTime.toISOString())
    return h.redirect(constants.routes.SMELL_CURRENT)
  }
}

const validatePayload = (time) => {
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
  } else {
    // do nothing
  }
  return errorSummary
}

const getContext = request => {
  const time = request.yar.get(constants.redisKeys.SMELL_YESTERDAY)
  return {
    time
  }
}

const getDateTime = (time) => {
  const minusTwo = -2
  const date = new Date()
  date.setDate(date.getDate() - 1)
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

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_YESTERDAY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_YESTERDAY,
    handler: handlers.post
  }
]
