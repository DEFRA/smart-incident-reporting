'use strict'

// (see https://www.npmjs.com/package/dotenv)

const joi = require('joi')
const envs = ['development', 'test', 'production']

const getBoolean = booleanString =>
  String(booleanString).toLowerCase() === 'true'

const defaultUrl = 'http://some-url'

// Define config schema
const schema = joi.object().keys({
  env: joi
    .string()
    .valid(...envs)
    .default(envs[0]),
  serviceHost: joi.string(),
  servicePort: joi.number().default(3000),
  serviceName: joi
    .string()
    .default('Smart incident reporting'),
  logLevel: joi.string().default('warn'),
  requestTimeout: joi.number(),
  maximumFileSize: joi.number().default(10),
  cookieTimeout: joi.number(),
  cookieValidationPassword: joi
    .string()
    .default('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  serviceHost: process.env.SERVICE_HOST,
  servicePort: process.env.SERVICE_PORT,
  serviceName: process.env.SERVICE_NAME,
  logLevel: process.env.LOG_LEVEL,
  requestTimeout: process.env.REQUEST_TIMEOUT,
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

// Add some helper props
value.isDev = value.env === 'development'

module.exports = value
