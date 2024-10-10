import Joi from 'joi'
const envs = ['development', 'test', 'production']
const defaultPort = 8000
const defaultRedisPort = 6379

const getBoolean = booleanString =>
  String(booleanString).toLowerCase() === 'true'

// Define config schema
const schema = Joi.object().keys({
  env: Joi
    .string()
    .valid(...envs)
    .default(envs[0]),
  servicePort: Joi.number().default(defaultPort),
  redisHost: Joi.string().default('localhost'),
  redisPort: Joi.number().default(defaultRedisPort),
  redisPassword: Joi.string(),
  redisTls: Joi.bool().default(false),
  logLevel: Joi.string().default('warn'),
  sessionCookiePassword: Joi.string().default('the-password-must-be-at-least-32-characters-long'),
  authCookiePassword: Joi.string().default('the-password-must-be-at-least-32-characters-long'),
  cookieIsSecure: Joi.bool().default(false),
  osSecret: Joi.string(),
  osKey: Joi.string(),
  serviceBusConnectionString: Joi.string().required(),
  serviceBusQueueName: Joi.string().required(),
  accounts: Joi.array().items(Joi.object().keys({
    id: Joi.number(),
    password: Joi.string()
  })).required(),
  serviceAvailableCron: Joi.string().default('* * * * * *')
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  servicePort: process.env.SERVICE_PORT,
  logLevel: process.env.LOG_LEVEL,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  redisTls: getBoolean(process.env.REDIS_TLS),
  sessionCookiePassword: process.env.SESSION_COOKIE_PASSWORD,
  authCookiePassword: process.env.SESSION_COOKIE_PASSWORD,
  cookieIsSecure: getBoolean(process.env.COOKIE_IS_SECURE),
  osSecret: process.env.OS_SECRET,
  osKey: process.env.OS_KEY,
  serviceBusConnectionString: process.env.SERVICE_BUS_CONNECTION_STRING,
  serviceBusQueueName: process.env.SERVICE_BUS_QUEUE_NAME,
  accounts: JSON.parse(process.env.AUTH_ACCOUNTS),
  serviceAvailableCron: process.env.SERVICE_AVAILABLE_CRON
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
