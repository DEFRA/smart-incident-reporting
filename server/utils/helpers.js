import fs from 'fs'
import constants from './constants.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const sirpSchema = JSON.parse(fs.readFileSync('./server/schemas/sirp-schema.json'))
const feedbackSchema = JSON.parse(fs.readFileSync('./server/schemas/feedback-schema.json'))

const getErrorSummary = () => {
  return JSON.parse(JSON.stringify(constants.errorSummary))
}

const validatePayload = (payload, feedback = false) => {
  const schema = !feedback ? sirpSchema : feedbackSchema
  const ajv = new Ajv({ strict: false })
  addFormats(ajv)
  const valid = ajv.validate(schema, payload)
  if (!valid) {
    console.error(ajv.errors)
  }
  return valid
}

// Borrowed from https://github.com/DEFRA/biodiversity-net-gain-service/blob/master/packages/webapp/src/utils/helpers.js#L487
const validateEmail = email => {
  const maxLength = 255
  const tester = /^[-!#$%&'*+\0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
  // https://en.wikipedia.org/wiki/Email_address  The format of an email address is local-part@domain, where the
  // local part may be up to 64 octets long and the domain may have a maximum of 255 octets.
  if (!email || email.length === 0 || email.length > maxLength) {
    return false
  }

  const emailParts = email.split('@')

  if (emailParts.length !== 2 || !tester.test(email)) {
    return false
  }

  const account = emailParts[0]
  const address = emailParts[1]
  if (account.length > 64 || address.length > maxLength) {
    return false
  }

  const domainParts = address.split('.')

  // https://en.wikipedia.org/wiki/Email_address#Domain
  // It must match the requirements for a hostname, a list of dot-separated DNS labels, each label being limited to a length of 63 characters
  const domainIssue = domainParts.some(part => {
    return part.length > 63
  })

  return !domainIssue
}

export {
  getErrorSummary,
  validatePayload,
  validateEmail
}
