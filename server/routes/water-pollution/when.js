import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import moment from 'moment'
import { dateValidateAndError } from '../../utils/date-validate.js'

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

    return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
  }
}

const validatePayload = (payload, validateAndError) => {
  const emptyErrorSummary = getErrorSummary()
  const validateErrorSummary = getErrorSummary()
  const errorSummary = getErrorSummary()
  let emptyDateCount = 0
  let emptyDateError = ''
  let emptyDateId = ''
  let emptyTimeCount = 0
  let emptyTimeError = ''
  let emptyTimeId = ''
  let dateTime
  for (const [key, value] of Object.entries(payload)) {
    validateAndError[key].value = value
    validateAndError[key].isEmpty = !value
    validateAndError[key].isValid = validateAndError[key].validate(value)
    if (validateAndError[key].isDatePart && !value) {
      emptyDateCount++
      emptyDateError = validateAndError[key].emptyError
      emptyDateId = !emptyDateId ? validateAndError[key].id : emptyDateId
    }
    if (!validateAndError[key].isDatePart && !value) {
      emptyTimeCount++
      emptyTimeError = validateAndError[key].emptyError
      emptyTimeId = !emptyTimeId ? validateAndError[key].id : emptyTimeId
    }
    if (!validateAndError[key].isValid) {
      validateErrorSummary.errorList.push({
        text: validateAndError[key].validateError,
        href: validateAndError[key].id
      })
    }
  }

  // Check for mandatory fields
  if (emptyDateCount > 0) {
    emptyErrorSummary.errorList.push({
      text: emptyDateCount === 1 ? emptyDateError : 'Date must include day, month and year, for example 27 1 2024',
      href: emptyDateId
    })
  }
  if (emptyTimeCount > 0) {
    emptyErrorSummary.errorList.push({
      text: emptyTimeCount === 1 ? emptyTimeError : 'Time must include hours, minutes and am or pm, for example 2:25pm',
      href: emptyTimeId
    })
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
      errorSummary.errorList.push({
        text: 'The date entered must be a real date',
        href: '#date-day'
      })
      validateAndError.day.isValid = false
      validateAndError.month.isValid = false
      validateAndError.year.isValid = false
      return {
        errorSummary
      }
    }
  }

  return checkValidDate(dateTime, validateAndError, errorSummary)
}

const checkValidDate = (dateTime, validateAndError, errorSummary) => {
  if (dateTime.isBefore(moment().subtract(1, 'years'))) {
    errorSummary.errorList.push({
      text: 'Date must be in the past year',
      href: '#date-day'
    })
    validateAndError.day.isValid = false
    validateAndError.month.isValid = false
    validateAndError.year.isValid = false
    return {
      errorSummary
    }
  }

  if (dateTime.isAfter(moment(), 'days')) {
    errorSummary.errorList.push({
      text: 'Date must be today or in the past year',
      href: '#date-day'
    })
    validateAndError.day.isValid = false
    validateAndError.month.isValid = false
    validateAndError.year.isValid = false
    return {
      errorSummary
    }
  }

  if (dateTime.isAfter(moment().add(5, 'minutes'))) {
    errorSummary.errorList.push({
      text: 'Time must be in the past',
      href: '#minute'
    })
    validateAndError.hour.isValid = false
    validateAndError.minute.isValid = false
    validateAndError.period.isValid = false
    return {
      errorSummary
    }
  }

  return {
    errorSummary: getErrorSummary(),
    dateTime
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
