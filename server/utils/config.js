'use strict'

// (see https://www.npmjs.com/package/dotenv)

const joi = require('joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  env: joi
    .string()
    .valid(...envs)
    .default(envs[0]),
  serviceHost: joi.string(),
  servicePort: joi.number().default(8000),
  serviceName: joi
    .string()
    .default('Report an environmental incident'),
  redisHost: joi.string().default('localhost'),
  redisPort: joi.number().default(6379),
  redisPassword: joi.string(),
  logLevel: joi.string().default('warn'),
  requestTimeout: joi.number(),
  maximumFileSize: joi.number().default(10),
  cookieTimeout: joi.number().default(90000),
  cookieValidationPassword: joi
    .string()
    .default('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
  osDataURI: joi.string().default('https://osdatahub.co.uk')
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  serviceHost: process.env.SERVICE_HOST,
  servicePort: process.env.SERVICE_PORT,
  serviceName: process.env.SERVICE_NAME,
  logLevel: process.env.LOG_LEVEL,
  requestTimeout: process.env.REQUEST_TIMEOUT,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  osDataURI: process.env.OS_DATA_HUB_URI
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
