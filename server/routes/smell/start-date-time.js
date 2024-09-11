import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
import {
  dateValidateAndError,
  fieldErrorClasses,
  getDateErrors,
  getTimeErrors,
  validatePayload
} from '../../utils/date-helpers.js'

const question = questionSets.SMELL.questions.SMELL_PREVIOUS

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_START_DATE_TIME, {
      fieldErrorClasses,
      getDateErrors,
      getTimeErrors,
      validateAndError: dateValidateAndError(),
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const validateAndError = dateValidateAndError()
    if (!request.payload.current) {
      const errorSummary = getErrorSummary()
      errorSummary.errorList.push({
        text: 'Select when the smell started',
        href: '#current'
      })
      return h.view(constants.views.SMELL_START_DATE_TIME, {
        errorSummary,
        validateAndError,
        fieldErrorClasses,
        getDateErrors,
        getTimeErrors,
        ...getContext(request)
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
      return h.view(constants.views.SMELL_START_DATE_TIME, {
        errorSummary,
        validateAndError,
        fieldErrorClasses,
        getDateErrors,
        getTimeErrors,
        ...getContext(request),
        current: request.payload.current
      })
    }

    request.yar.set(constants.redisKeys.SMELL_START_DATE_TIME, dateTime.toISOString())
    return h.redirect(constants.routes.SMELL_CURRENT)
  }
}

const getContext = request => {
  const recurringProblem = request.yar.get(constants.redisKeys.SMELL_PREVIOUS)
  const onThisOccasion = (recurringProblem && recurringProblem[0].answerId !== question.answers.no.answerId)
  return {
    onThisOccasion
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_START_DATE_TIME,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_START_DATE_TIME,
    handler: handlers.post
  }
]
