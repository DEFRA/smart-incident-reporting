'use strict'

const config = require('../utils/config')

const _getSettings = () => {
  const settings = {
    host: config.redisHost,
    port: config.redisPort
  }

  if (config.redisPassword) {
    settings.password = config.redisPassword
  }

  // Needed to connect to local cache
  // settings.tls = { host: config.redisHost }

  // Needed to connect to azure redis cache
  // if (config.redisUseTls) {
  settings.tls = {}
  // }

  console.log('Redis settings ' + JSON.stringify(settings))
  return settings
}

module.exports = {
  plugin: require('hapi-redis2'),
  options: {
    settings: _getSettings(),
    decorate: true
  }
}
