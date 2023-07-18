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

  if (config.redisUseTls) {
    settings.tls = {}
  }

  return settings
}

module.exports = {
  plugin: require('hapi-redis2'),
  options: {
    settings: _getSettings(),
    decorate: true
  }
}
