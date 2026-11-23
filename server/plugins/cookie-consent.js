import { clearAnalyticsCookies, getAnalyticsPreference } from '../utils/cookie-consent.js'

export default {
  name: 'cookie-consent',
  register: server => {
    server.ext('onPreResponse', (request, h) => {
      const optingOut = request.path === '/cookies' && request.method === 'post' && ['false', 'No'].includes(request.payload?.analytics)
      if (optingOut || getAnalyticsPreference(request) === 'off') {
        clearAnalyticsCookies(request.response, request)
      }
      return h.continue
    })
  }
}
