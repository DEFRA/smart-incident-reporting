import dotenv from 'dotenv'
import Joi from 'joi'
dotenv.config()
const envs = ['development', 'test', 'production']

const getBoolean = booleanString =>
  String(booleanString).toLowerCase() === 'true'

// Define config schema
const schema = Joi.object().keys({
  env: Joi
    .string()
    .valid(...envs)
    .default(envs[0]),
  serviceHost: Joi.string(),
  servicePort: Joi.number().default(8000),
  serviceName: Joi
    .string()
    .default('Report an environmental incident'),
  redisHost: Joi.string().default('localhost'),
  redisPort: Joi.number().default(6379),
  redisPassword: Joi.string(),
  redisTls: Joi.bool().default(false),
  logLevel: Joi.string().default('warn'),
  requestTimeout: Joi.number(),
  maximumFileSize: Joi.number().default(10),
  cookieTimeout: Joi.number().default(90000),
  cookieValidationPassword: Joi
    .string()
    .default('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
  sessionCookiePassword: Joi.string().default('the-password-must-be-at-least-32-characters-long'),
  cookieIsSecure: Joi.bool().default(false),
  osDataURI: Joi.string().default('https://osdatahub.co.uk'),
  osKey: Joi.string(),
  submitIncident: Joi.bool().valid(true, false),
  fishingConnectionString: Joi.string(),
  waterConnectionString: Joi.string(),
  fishingQueue: Joi.string(),
  waterQueue: Joi.string()
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
  redisTls: getBoolean(process.env.REDIS_TLS),
  sessionCookiePassword: process.env.SESSION_COOKIE_PASSWORD,
  cookieIsSecure: getBoolean(process.env.COOKIE_IS_SECURE),
  osDataURI: process.env.OS_DATA_HUB_URI,
  osKey: process.env.OS_KEY,
  submitIncident: getBoolean(process.env.SUBMIT_INCIDENT),
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

export default {
  ...value
}
