import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'
import {
  dateValidateAndError,
  fieldErrorClasses,
  getDateErrors,
  validatePayload
} from '../../utils/date-helpers.js'

const createDateBeforeYesterdayRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_DATE_BEFORE_YESTERDAY, {
        fieldErrorClasses,
        getDateErrors,
        validateAndError: dateValidateAndError(),
        ...getContext(request),
        ...serviceDetails
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
        return h.view(constants.views.RARS_DATE_BEFORE_YESTERDAY, {
          errorSummary,
          validateAndError,
          fieldErrorClasses,
          getDateErrors,
          ...payload,
          ...serviceDetails
        })
      }

      const dateString = `${payload.year}-${payload.month.padStart(2, '0')}-${payload.day.padStart(2, '0')}`
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const dateWordString = `${payload.day} ${months[(Number(payload.month)) - 1]} ${payload.year}`

      request.yar.set(constants.redisKeys.RARS_DATE_BEFORE_YESTERDAY, { dateString, dateWordString, payload })
      return h.redirect(redirect.timeBeforeYesterday)
    }
  }

  const getContext = request => {
    const answers = request.yar.get(constants.redisKeys.RARS_DATE_BEFORE_YESTERDAY)
    const day = answers?.payload.day || ''
    const month = answers?.payload.month || ''
    const year = answers?.payload.year || ''

    return {
      day,
      month,
      year
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

export default createDateBeforeYesterdayRoutes
