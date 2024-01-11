import Yar from '@hapi/yar'
import config from '../utils/config.js'

const session = {
  plugin: Yar,
  options: {
    cookieOptions: {
      password: config.sessionCookiePassword,
      isSecure: config.cookieIsSecure
    },
    maxCookieSize: 0,
    cache: {
      cache: 'redis_cache',
      expiresIn: 24 * 60 * 60 * 1000,
      segment: 'session'
    }
  }
}

export default session
