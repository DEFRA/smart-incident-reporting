import constants from '../../utils/constants.js'
import {
  dateValidateAndError,
  fieldErrorClasses,
  getDateErrors,
  getTimeErrors,
  validatePayload
} from '../../utils/date-helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    const recurringProblem = request.yar.get(constants.redisKeys.SMELL_RECURRING_PROBLEM)
    const onThisOccasion = (recurringProblem && recurringProblem[0].answerId === questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.answers.no.answerId)
    return h.view(constants.views.SMELL_DATE_TIME, {
      onThisOccasion,
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
      const recurringProblem = request.yar.get(constants.redisKeys.SMELL_RECURRING_PROBLEM)
      const onThisOccasion = (recurringProblem && recurringProblem[0].answerId === questionSets.SMELL.questions.SMELL_RECURRING_PROBLEM.answers.no.answerId)
      return h.view(constants.views.SMELL_DATE_TIME, {
        errorSummary,
        validateAndError,
        fieldErrorClasses,
        getDateErrors,
        getTimeErrors,
        onThisOccasion
      })
    }

    request.yar.set(constants.redisKeys.SMELL_DATE_TIME, dateTime.toISOString())

    return h.redirect(constants.routes.SMELL_ONGOING)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_DATE_TIME,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_DATE_TIME,
    handler: handlers.post
  }
]
