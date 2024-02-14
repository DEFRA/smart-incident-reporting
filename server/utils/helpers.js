import fs from 'fs'
import constants from './constants.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const jsonSchema = JSON.parse(fs.readFileSync('./server/schemas/sirp-schema.json'))

const getErrorSummary = () => {
  return JSON.parse(JSON.stringify(constants.errorSummary))
}

const validatePayload = payload => {
  const ajv = new Ajv({ strict: false })
  addFormats(ajv)
  const valid = ajv.validate(jsonSchema, payload)
  if (!valid) {
    console.error(ajv.errors)
  }
  return valid
}

export {
  getErrorSummary,
  validatePayload
}
