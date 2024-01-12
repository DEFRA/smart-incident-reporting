import { postcodeValidator } from 'postcode-validator'

const VALIDATION_SUMMARY_HEADING = 'There is a problem'

const email = value =>
  value.match(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  )

const empty = value => !value || value.toString().trim().length === 0

const maxLength = (value, characterLimit) => value && value.toString().trim().length > characterLimit

const postcode = value => !value || postcodeValidator(value.toString().trim(), 'GB')

const buildErrorSummary = errors =>
  errors && errors.length
    ? {
        errorSummary: {
          titleText: VALIDATION_SUMMARY_HEADING,
          errorList: errors.map(({ name, text }) => ({
            text,
            href: `#${name}`
          }))
        },
        fieldErrors: errors.reduce(
          (fieldErrors, { name, text }) => ({
            ...fieldErrors,
            [name]: { text }
          }),
          {}
        )
      }
    : {}

export {
  email,
  empty,
  maxLength,
  postcode,
  buildErrorSummary
}
