import moment from 'moment'
import { getErrorSummary } from './helpers.js'
const zero = 0
const monthsOrHours = 12
const maxDays = 31
const maxMinutes = 59
const firstValidYear = 1900
const latestYear = 3000
const maxAgeMinutes = 5

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
    },
    hour: {
      id: '#hour',
      isDatePart: false,
      validate: (val) => {
        return (val > zero && val <= monthsOrHours)
      },
      emptyError: 'Time must include an hour from 1 to 12',
      validateError: 'Time must include an hour from 1 to 12, for midnight use 12:00am',
      isEmpty: false,
      isValid: true
    },
    minute: {
      id: '#minute',
      isDatePart: false,
      validate: (val) => {
        return (val >= zero && val <= maxMinutes)
      },
      emptyError: 'Time must include minutes from 0 to 59',
      validateError: 'Time must include minutes from 0 to 59',
      isEmpty: false,
      isValid: true
    },
    period: {
      id: '#period',
      isDatePart: false,
      validate: (val) => {
        return (val === 'am' || val === 'pm')
      },
      emptyError: 'Time must include am or pm',
      validateError: 'Time must include am or pm',
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
  return dateErrors.length > 0 ? dateErrors : undefined
}

const getTimeErrors = (errorSummary, validateAndError) => {
  const timeErrors = []
  errorSummary?.errorList.forEach(item => {
    if (item.href.includes(validateAndError.hour.id) || item.href.includes(validateAndError.minute.id) || item.href.includes(validateAndError.period.id)) {
      timeErrors.push(item)
    }
  })
  return timeErrors.length > 0 ? timeErrors : undefined
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
    const text = issues.emptyDateCount === 1 ? issues.emptyDateError : 'Date must include day, month and year'
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
    dateTime = moment.utc(dateString, 'YYYY-MM-DD hh:mm a')
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
  getTimeErrors,
  validatePayload,
  getDateContext
}
