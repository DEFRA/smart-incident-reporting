import moment from 'moment'
import { getErrorSummary } from './helpers.js'
const zero = 0
const monthsOrHours = 12
const maxDays = 31
const maxMinutes = 59
const firstValidYear = 1900
const latestYear = 3000

const dateValidateAndError = () => {
  return {
    day: {
      id: '#date-day',
      isDatePart: true,
      validate: (val) => {
        return (val > zero && val <= maxDays)
      },
      emptyError: 'Date must include a day',
      validateError: 'Date must include a day from 1 to 31',
      isEmpty: false,
      isValid: true
    },
    month: {
      id: '#date-month',
      isDatePart: true,
      validate: (val) => {
        return (val > zero && val <= monthsOrHours)
      },
      emptyError: 'Date must include a month',
      validateError: 'Date must include a month using numbers 1 to 12',
      isEmpty: false,
      isValid: true
    },
    year: {
      id: '#date-year',
      isDatePart: true,
      validate: (val) => {
        return (val > firstValidYear && val <= latestYear)
      },
      emptyError: 'Date must include a year',
      validateError: 'Date must include a full year, for example 2024',
      isEmpty: false,
      isValid: true
    }
  }
}

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
  console.log('DATA FOR dateErrors', dateErrors)
  return dateErrors.length > 0 ? dateErrors : undefined
}

const validatePayload = (payload, validateAndError) => {
  const emptyErrorSummary = getErrorSummary()
  const validateErrorSummary = getErrorSummary()

  const issues = {
    emptyDateCount: 0,
    emptyDateError: '',
    emptyDateId: ''
  }
  let date

  processPayloadValidation(payload, validateAndError, validateErrorSummary, issues)

  // Check for mandatory fields
  if (issues.emptyDateCount > 0) {
    const text = issues.emptyDateCount === 1 ? issues.emptyDateError : 'Enter a date'
    returnError(emptyErrorSummary, validateAndError, text, issues.emptyDateId, false, false)
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
    const dateString = `${payload.year}-${payload.month.padStart(2, '0')}-${payload.day.padStart(2, '0')}`
    date = moment(dateString, 'YYYY-MM-DD')
    if (!date.isValid()) {
      return returnError(getErrorSummary(), validateAndError, 'The date entered must be a real date', '#date-day', true, false)
    }
  }

  return checkValidDate(date, validateAndError)
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
    if (!validateAndError[key].isValid) {
      validateErrorSummary.errorList.push({
        text: validateAndError[key].validateError,
        href: validateAndError[key].id
      })
    }
  }
}

const checkValidDate = (date, validateAndError) => {
  if (date.isBefore(moment().subtract(1, 'years'))) {
    return returnError(getErrorSummary(), validateAndError, 'Date must be in the past year', '#date-day', true)
  }

  if (date.isAfter(moment(), 'days')) {
    return returnError(getErrorSummary(), validateAndError, 'Date must be today or in the past year', '#date-day', true)
  }

  return {
    errorSummary: getErrorSummary(),
    date
  }
}

const returnError = (errorSummary, validateAndError, text, href, invalidDate) => {
  errorSummary.errorList.push({
    text,
    href
  })
  if (invalidDate) {
    validateAndError.day.isValid = false
    validateAndError.month.isValid = false
    validateAndError.year.isValid = false
  }
  return {
    errorSummary
  }
}

const getDateContext = answer => {
  let context = {}
  if (answer) {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const date = new Date(answer)

    const isToday = date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    const isYesterday = date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()

    const twelve = 12
    const thirteen = 13

    context = {
      isToday,
      isYesterday,
      isEarlier: !(isToday || isYesterday),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: date.getHours() < thirteen ? date.getHours() : date.getHours() - twelve,
      minute: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
      period: date.getHours() < twelve ? 'am' : 'pm',
      isPageReturn: true
    }
  }
  return context
}

export {
  dateValidateAndError,
  fieldErrorClasses,
  getDateErrors,
  validatePayload,
  getDateContext
}
