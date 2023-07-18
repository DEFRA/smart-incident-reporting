'use strict'

const { SI_SESSION_KEY } = require('../utils/constants')

module.exports = class CookieService {
  static getSessionCookie (request, displayLogMessage = true) {
    const sessionCookie = request.state[SI_SESSION_KEY]
    if (!sessionCookie) {
      console.log(`Session cookie not found for page ${request.url.pathname}`)
    }
    return sessionCookie
  }
}
