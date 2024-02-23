const dateValidateAndError = () => {
  return {
    day: {
      id: '#date-day',
      isDatePart: true,
      validate: (val) => {
        return (val > 0 && val <= 31)
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
        return (val > 0 && val <= 12)
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
        return (val > 1900 && val <= 3000)
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
        return (val > 0 && val <= 12)
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
        return (val >= 0 && val <= 59)
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

export {
  dateValidateAndError
}
