import Hapi from '@hapi/hapi'
import config from './utils/config.js'
import Bcrypt from 'bcrypt'
import Basic from '@hapi/basic'
import Blipp from 'blipp'
import errorPages from './plugins/error-pages.js'
import inert from './plugins/inert.js'
import router from './plugins/router.js'
import views from './plugins/views.js'
import redis from './plugins/redis.js'
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
  await server.register(redis)
  await server.register(Blipp)
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
