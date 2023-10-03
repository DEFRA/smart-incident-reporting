'use strict'

const config = require('./utils/config')
const hapi = require('@hapi/hapi')
const Bcrypt = require('bcrypt')

const {
  SI_SESSION_KEY
} = require('./utils/constants')

const users = {
  smart: {
    username: config.defraUsername,
    password: config.defraPassword
  }
}

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
  _createSessionCookie(server)
  console.log(`Server started at port ${config.servicePort}...`)
  return server
}

const _registerPlugins = async server => {
  if (config.useBasicAuth) {
    await server.register(require('@hapi/basic'))
    server.auth.strategy('simple', 'basic', { validate })
    server.auth.default('simple')
  }
  await server.register(require('./plugins/error-pages.plugin'))
  await server.register(require('./plugins/inert.plugin'))
  await server.register(require('./plugins/router.plugin'))
  await server.register(require('./plugins/views.plugin'))
  await server.register(require('./plugins/hapi-gapi.plugin'))
  await server.register(require('./plugins/redis.plugin'))
}

const validate = async (request, username, password) => {
  const user = users[username]
  if (!user) {
    return { credentials: null, isValid: false }
  }

  const isValid = await Bcrypt.compare(password, user.password)
  const credentials = { id: user.id, name: user.name }

  return { isValid, credentials }
}

const _createSessionCookie = server => {
  server.state(SI_SESSION_KEY)
}

module.exports = createServer
