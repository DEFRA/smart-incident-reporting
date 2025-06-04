import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import {
  dateValidateAndError,
  fieldErrorClasses,
  getDateErrors,
  validatePayload
} from '../../utils/date-helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_DATE_BEFORE_YESTERDAY, {
      fieldErrorClasses,
      getDateErrors,
      validateAndError: dateValidateAndError(),
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const validateAndError = dateValidateAndError()
    const payload = {
      day: request.payload['date-day'],
      month: request.payload['date-month'],
      year: request.payload['date-year']
    }

    // validate payload for errors
    const { errorSummary } = validatePayload(payload, validateAndError)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_DATE_BEFORE_YESTERDAY, {
        errorSummary,
        validateAndError,
        fieldErrorClasses,
        getDateErrors,
        ...payload
      })
    }

    const dateString = `${payload.year}-${payload.month.padStart(2, '0')}-${payload.day.padStart(2, '0')}`
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dateWordString = `${payload.day.padStart(2, '0')} ${months[(Number(payload.month)) - 1]} ${payload.year}`

    request.yar.set(constants.redisKeys.WATER_POLLUTION_DATE_BEFORE_YESTERDAY, { dateString, dateWordString, payload })
    return h.redirect(constants.routes.WATER_POLLUTION_TIME_BEFORE_YESTERDAY)
  }
}

const getContext = request => {
  const answers = request.yar.get(constants.redisKeys.WATER_POLLUTION_DATE_BEFORE_YESTERDAY)
  const day = answers?.payload.day || ''
  const month = answers?.payload.month || ''
  const year = answers?.payload.year || ''

  return {
    day,
    month,
    year
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_DATE_BEFORE_YESTERDAY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_DATE_BEFORE_YESTERDAY,
    handler: handlers.post
  }
]
