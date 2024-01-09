import constants from '../utils/constants.js'
export default class CookieService {
  static getSessionCookie (request, displayLogMessage = true) {
    const sessionCookie = request.state[constants.SI_SESSION_KEY]
    if (!sessionCookie) {
      console.log(`Session cookie not found for page ${request.url.pathname}`)
    }
    return sessionCookie
  }
}
