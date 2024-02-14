import Cookie from '@hapi/cookie'
import config from '../utils/config.js'

const strategy = 'session-auth'

const auth = {
  name: 'auth',
  register: async (server, _options) => {
    await server.register(Cookie)
    server.auth.strategy(strategy, 'cookie', {
      cookie: {
        name: strategy,
        path: '/',
        password: config.authCookiePassword,
        isSecure: config.cookieIsSecure,
        isSameSite: 'Lax'
      },
      keepAlive: false,
      redirectTo: '/',
      appendNext: false
    })
    server.auth.default(strategy)
  }
}

export default auth
