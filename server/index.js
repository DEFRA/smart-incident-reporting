'use strict'

const config = require('./utils/config')
const hapi = require('@hapi/hapi')
const Bcrypt = require('bcrypt')

const {
  SI_SESSION_KEY
} = require('./utils/constants')

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
  await server.register(require('./plugins/error-pages.plugin'))
  await server.register(require('./plugins/inert.plugin'))
  await server.register(require('./plugins/router.plugin'))
  await server.register(require('./plugins/views.plugin'))
  await server.register(require('./plugins/hapi-gapi.plugin'))
  await server.register(require('./plugins/redis.plugin'))
  await server.register(require('@hapi/basic'))
  await server.auth.strategy('simple', 'basic', { validate })
  await server.auth.default('simple')
}

const users = {
  smart: {
    username: 'smart',
    password: '$2a$10$bdNlhk7QgjGrLrnCqr3mYe1gmjpsNm/dAU17lcaGNZk9y/Gi/WhKy', // 'incident'
    name: 'John Doe',
    id: '2133d32a'
  }
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
