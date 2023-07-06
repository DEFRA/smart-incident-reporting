'use strict'

const config = require('./utils/config')
const hapi = require('@hapi/hapi')

const createServer = async () => {
  const server = hapi.server({
    port: config.servicePort,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  await _registerPlugins(server)
  console.log(`Server started at port ${config.servicePort}...`)
  return server
}

const _registerPlugins = async server => {
  await server.register(require('./plugins/error-pages.plugin'))
  await server.register(require('./plugins/inert.plugin'))
  await server.register(require('./plugins/router.plugin'))
  await server.register(require('./plugins/views.plugin'))
}

module.exports = createServer
