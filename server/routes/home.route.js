'use strict'

const { v4: uuidv4 } = require('uuid')
const CookieService = require('../services/cookie.service')
const RedisService = require('../services/redis.service')

const {
  HOME_URL,
  Paths,
  SI_SESSION_KEY
} = require('../utils/constants')

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
  h.state(SI_SESSION_KEY, uuidv4())
}

module.exports = [
  {
    method: 'GET',
    path: HOME_URL,
    handler: handlers.get
  }
]
