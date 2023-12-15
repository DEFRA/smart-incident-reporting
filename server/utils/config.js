'use strict'

// (see https://www.npmjs.com/package/dotenv)
require('dotenv').config()

const joi = require('joi')
const envs = ['development', 'test', 'production']

const getBoolean = booleanString =>
  String(booleanString).toLowerCase() === 'true'

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
  osDataURI: joi.string().default('https://osdatahub.co.uk'),
  osKey: joi.string(),
  useBasicAuth: joi.bool().valid(true, false),
  defraUsername: joi.string(),
  defraPassword: joi.string(),
  submitIncident: joi.bool().valid(true, false),
  fishingConnectionString: joi.string(),
  waterConnectionString: joi.string(),
  fishingQueue: joi.string(),
  waterQueue: joi.string()
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
  osDataURI: process.env.OS_DATA_HUB_URI,
  osKey: process.env.OS_KEY,
  useBasicAuth: getBoolean(process.env.USE_BASIC_AUTH || false),
  defraUsername: process.env.DEFRA_USERNAME,
  defraPassword: process.env.DEFRA_PASSWORD,
  submitIncident: getBoolean(process.env.SUBMIT_INCIDENT || false),
  fishingConnectionString: process.env.FISHING_CONNECTION_STRING,
  waterConnectionString: process.env.WATER_CONNECTION_STRING,
  fishingQueue: process.env.FISHING_QUEUE,
  waterQueue: process.env.WATER_QUEUE
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
