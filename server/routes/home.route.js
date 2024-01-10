import * as uuid from 'uuid'
import CookieService from '../services/cookie.service.js'
import RedisService from '../services/redis.service.js'
import constants from '../utils/constants.js'

const {
  HOME_URL,
  Paths,
  SI_SESSION_KEY
} = constants

const handlers = {
  get: async (request, h) => {
    const sessionCookie = CookieService.getSessionCookie(request, false)
    if (sessionCookie) {
      RedisService.deleteSessionData(request)
    }
    _setCookieSessionId(h)

    return h.redirect(Paths.WELCOME)
  }
}

const _setCookieSessionId = h => {
  h.state(SI_SESSION_KEY, uuid.v4())
}

export default [
  {
    method: 'GET',
    path: HOME_URL,
    handler: handlers.get
  }
]
