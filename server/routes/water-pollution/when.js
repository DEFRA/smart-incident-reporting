import constants from '../../utils/constants.js'
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
    const payload = {
      day: request.payload['date-day'],
      month: request.payload['date-month'],
      year: request.payload['date-year'],
      hour: request.payload.hour,
      minute: request.payload.minute,
      period: request.payload.period
    }

    // validate payload for errors
    const { errorSummary, dateTime } = validatePayload(payload, validateAndError)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_WHEN, {
        errorSummary,
        validateAndError,
        fieldErrorClasses,
        getDateErrors,
        getTimeErrors
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
