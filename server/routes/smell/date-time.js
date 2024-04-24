// Note that this will need to refactored into shared code once other journeys have the same date entry
import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import moment from 'moment'
import { dateValidateAndError } from '../../utils/date-validate.js'
import { questionSets } from '../../utils/question-sets.js'

const maxAgeMinutes = 5

const fieldErrorClasses = (item, defaultClass) => {
  if (item) {
    return defaultClass + (item.isEmpty || !item.isValid ? ' govuk-input--error' : '')
  } else {
    return defaultClass
  }
}

const getDateErrors = (errorSummary, validateAndError) => {
  const dateErrors = []
  errorSummary?.errorList.forEach(item => {
    if (item.href === validateAndError.day.id || item.href === validateAndError.month.id || item.href === validateAndError.year.id) {
      dateErrors.push(item)
    }
  })
  return dateErrors.length > 0 ? dateErrors : undefined
}

const getTimeErrors = (errorSummary, validateAndError) => {
  const dateErrors = []
  errorSummary?.errorList.forEach(item => {
    if (item.href === validateAndError.hour.id || item.href === validateAndError.minute.id || item.href === validateAndError.period.id) {
      dateErrors.push(item)
    }
  })
  return dateErrors.length > 0 ? dateErrors : undefined
}

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

const validatePayload = (payload, validateAndError) => {
  const emptyErrorSummary = getErrorSummary()
  const validateErrorSummary = getErrorSummary()

  const issues = {
    emptyDateCount: 0,
    emptyDateError: '',
    emptyDateId: '',
    emptyTimeCount: 0,
    emptyTimeError: '',
    emptyTimeId: ''
  }
  let dateTime

  processPayloadValidation(payload, validateAndError, validateErrorSummary, issues)

  // Check for mandatory fields
  if (issues.emptyDateCount > 0) {
    const text = issues.emptyDateCount === 1 ? issues.emptyDateError : 'Date must include day, month and year, for example 27 1 2024'
    returnError(emptyErrorSummary, validateAndError, text, issues.emptyDateId, false, false)
  }
  if (issues.emptyTimeCount > 0) {
    const text = issues.emptyTimeCount === 1 ? issues.emptyTimeError : 'Time must include hours, minutes and am or pm, for example 2:25pm'
    returnError(emptyErrorSummary, validateAndError, text, issues.emptyTimeId, false, false)
  }

  if (emptyErrorSummary.errorList.length > 0) {
    return {
      errorSummary: emptyErrorSummary
    }
  } else if (validateErrorSummary.errorList.length > 0) {
    return {
      errorSummary: validateErrorSummary
    }
  } else {
    // parse the date
    const dateString = `${payload.year}-${payload.month.padStart(2, '0')}-${payload.day.padStart(2, '0')} ${payload.hour.padStart(2, '0')}:${payload.minute.padStart(2, '0')} ${payload.period}`
    dateTime = moment(dateString, 'YYYY-MM-DD hh:mm a')
    if (!dateTime.isValid()) {
      return returnError(getErrorSummary(), validateAndError, 'The date entered must be a real date', '#date-day', true, false)
    }
  }

  return checkValidDate(dateTime, validateAndError)
}

const processPayloadValidation = (payload, validateAndError, validateErrorSummary, issues) => {
  for (const [key, value] of Object.entries(payload)) {
    validateAndError[key].value = value
    validateAndError[key].isEmpty = !value
    validateAndError[key].isValid = validateAndError[key].validate(value)
    if (validateAndError[key].isDatePart && !value) {
      issues.emptyDateCount++
      issues.emptyDateError = validateAndError[key].emptyError
      issues.emptyDateId = !issues.emptyDateId ? validateAndError[key].id : issues.emptyDateId
    }
    if (!validateAndError[key].isDatePart && !value) {
      issues.emptyTimeCount++
      issues.emptyTimeError = validateAndError[key].emptyError
      issues.emptyTimeId = !issues.emptyTimeId ? validateAndError[key].id : issues.emptyTimeId
    }
    if (!validateAndError[key].isValid) {
      validateErrorSummary.errorList.push({
        text: validateAndError[key].validateError,
        href: validateAndError[key].id
      })
    }
  }
}

const checkValidDate = (dateTime, validateAndError) => {
  if (dateTime.isBefore(moment().subtract(1, 'years'))) {
    return returnError(getErrorSummary(), validateAndError, 'Date must be in the past year', '#date-day', true, false)
  }

  if (dateTime.isAfter(moment(), 'days')) {
    return returnError(getErrorSummary(), validateAndError, 'Date must be today or in the past year', '#date-day', true, false)
  }

  if (dateTime.isAfter(moment().add(maxAgeMinutes, 'minutes'))) {
    return returnError(getErrorSummary(), validateAndError, 'Time must be in the past', '#minute', false, true)
  }

  return {
    errorSummary: getErrorSummary(),
    dateTime
  }
}

const returnError = (errorSummary, validateAndError, text, href, invalidDate, invalidTime) => {
  errorSummary.errorList.push({
    text,
    href
  })
  if (invalidDate) {
    validateAndError.day.isValid = false
    validateAndError.month.isValid = false
    validateAndError.year.isValid = false
  }
  if (invalidTime) {
    validateAndError.hour.isValid = false
    validateAndError.minute.isValid = false
    validateAndError.period.isValid = false
  }
  return {
    errorSummary
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
