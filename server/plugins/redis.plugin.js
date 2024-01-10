import config from '../utils/config.js'
import hapiRedis2 from 'hapi-redis2'

const _getSettings = () => {
  const settings = {
    host: config.redisHost,
    port: config.redisPort
  }

  if (config.redisPassword) {
    settings.password = config.redisPassword
  }

  // Needed to connect to azure cached
  // settings.tls = { host: config.redisHost }

  // Needed to connect to local cache
  // if (config.redisUseTls) {
  // settings.tls = {}
  // }

  console.log('Redis settings ' + JSON.stringify(settings))
  return settings
}

export default {
  plugin: hapiRedis2,
  options: {
    settings: _getSettings(),
    decorate: true
  }
}
