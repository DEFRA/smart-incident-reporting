import Hapi from '@hapi/hapi'
import config from './utils/config.js'
import Bcrypt from 'bcrypt'
import Basic from '@hapi/basic'
import errorPages from './plugins/error-pages.plugin.js'
import inert from './plugins/inert.plugin.js'
import router from './plugins/router.plugin.js'
import views from './plugins/views.plugin.js'
import redis from './plugins/redis.plugin.js'
// import hapiGapi from './plugins/hapi-gapi.plugin.js'
import constants from './utils/constants.js'

const users = {
  smart: {
    username: config.defraUsername,
    password: config.defraPassword
  }
}

const createServer = async () => {
  return new Hapi.Server({
    port: config.servicePort,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })
}

const init = async server => {
  await _registerPlugins(server)
  _createSessionCookie(server)
  await server.start()
  console.log(`Server started at port ${config.servicePort}...`)
}

const _registerPlugins = async server => {
  if (config.useBasicAuth) {
    await server.register(Basic)
    server.auth.strategy('simple', 'basic', { validate })
    server.auth.default('simple')
  }
  await server.register(errorPages)
  await server.register(inert)
  await server.register(router)
  await server.register(views)
  // await server.register(require('./plugins/hapi-gapi.plugin'))
  await server.register(redis)
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
  server.state(constants.SI_SESSION_KEY)
}

export { createServer, init }
