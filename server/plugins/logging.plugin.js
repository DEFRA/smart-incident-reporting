import config from '../utils/config.js'
import HapiPino from 'hapi-pino'

export default {
  plugin: HapiPino,
  options: {
    logPayload: true,
    prettyPrint: config.isDev,
    level: config.logLevel
  }
}
