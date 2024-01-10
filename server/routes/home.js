import * as uuid from 'uuid'
import CookieService from '../services/cookie.service.js'
import RedisService from '../services/redis.service.js'
import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const sessionCookie = CookieService.getSessionCookie(request, false)
    if (sessionCookie) {
      RedisService.deleteSessionData(request)
    }
    _setCookieSessionId(h)

    return h.redirect(constants.routes.WELCOME)
  }
}

const _setCookieSessionId = h => {
  h.state(constants.SI_SESSION_KEY, uuid.v4())
}

export default [
  {
    method: 'GET',
    path: constants.HOME_URL,
    handler: handlers.get
  }
]
