import config from '../utils/config.js'
import HapiPino from 'hapi-pino'

export default {
  plugin: HapiPino,
  options: {
    logPayload: true,
    level: config.logLevel
  }
}
