import Hapi from '@hapi/hapi'
import config from './utils/config.js'
import Blipp from 'blipp'
import errorPages from './plugins/error-pages.js'
import inert from './plugins/inert.js'
import router from './plugins/router.js'
import views from './plugins/views.js'
import cache from './plugins/cache.js'
import logging from './plugins/logging.js'
import session from './plugins/session.js'
import onPostHandler from './plugins/on-post-handler.js'

const createServer = async options => {
  // Create the hapi server
  options = {
    ...{
      port: config.servicePort,
      routes: {
        validate: {
          options: {
            abortEarly: false
          }
        },
        cors: true,
        security: true
      },
      cache
    },
    ...options
  }

  return new Hapi.Server(options)
}

const init = async server => {
  await _registerPlugins(server)
  await server.start()
}

const _registerPlugins = async server => {
  await server.register(logging)
  await server.register(session)
  await server.register(errorPages)
  await server.register(inert)
  await server.register(await router())
  await server.register(views)
  await server.register(Blipp)
  await server.register(onPostHandler)
}

export { createServer, init }
