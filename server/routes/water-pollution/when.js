import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import {
  dateValidateAndError,
  fieldErrorClasses,
  getDateErrors,
  getTimeErrors,
  validatePayload
} from '../../utils/date-helpers.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.WATER_POLLUTION_WHEN, {
      fieldErrorClasses,
      getDateErrors,
      getTimeErrors,
      validateAndError: dateValidateAndError()
    })
  },
  post: async (request, h) => {
    const validateAndError = dateValidateAndError()
    if (!request.payload.current) {
      const errors = getErrorSummary()
      errors.errorList.push({
        text: 'Select when you saw the pollution',
        href: '#current'
      })
      return h.view(constants.views.WATER_POLLUTION_WHEN, {
        errorSummary: errors,
        validateAndError,
        fieldErrorClasses,
        getDateErrors,
        getTimeErrors
      })
    }

    const payload = {
      day: request.payload.current === '2' ? request.payload['date-day'] : undefined,
      month: request.payload.current === '2' ? request.payload['date-month'] : undefined,
      year: request.payload.current === '2' ? request.payload['date-year'] : undefined,
      hour: request.payload.hour[Number(request.payload.current)],
      minute: request.payload.minute[Number(request.payload.current)],
      period: request.payload.period[Number(request.payload.current)]
    }
    // Fill in today or yesterday dates
    if (request.payload.current !== '2') {
      const date = new Date()
      if (request.payload.current === '1') {
        date.setDate(date.getDate() - 1)
      }
      payload.day = date.getDate().toString()
      payload.month = (date.getMonth() + 1).toString()
      payload.year = date.getFullYear().toString()
    }

    // validate payload for errors
    const { errorSummary, dateTime } = validatePayload(payload, validateAndError)
    if (errorSummary.errorList.length > 0) {
      errorSummary.errorList.forEach(item => {
        item.href = item.href.indexOf('date') === -1 ? `${item.href}-${request.payload.current}` : item.href
      })
      return h.view(constants.views.WATER_POLLUTION_WHEN, {
        errorSummary,
        validateAndError,
        fieldErrorClasses,
        getDateErrors,
        getTimeErrors,
        current: request.payload.current
      })
    }

    request.yar.set(constants.redisKeys.WATER_POLLUTION_WHEN, dateTime.toISOString())

    return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_SUBSTANCE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_WHEN,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_WHEN,
    handler: handlers.post
  }
]
