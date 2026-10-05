import { clearAnalyticsCookies, getPreference } from '../utils/cookie-consent.js'
import crypto from 'node:crypto'

const contentSecurityPolicy = nonce => [
  "default-src 'self'",
  `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com`,
  `style-src 'self' 'nonce-${nonce}'`,
  "font-src 'self' data:",
  "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self' https://www.googletagmanager.com",
  "form-action 'self'",
  "frame-ancestors 'self'"
].join('; ')

export default {
  name: 'cookie-consent',
  register: server => {
    server.ext('onPreResponse', (request, h) => {
      if (request.response.variety !== 'view' || !request.response.source?.context) {
        return h.continue
      }

      const cspNonce = crypto.randomBytes(16).toString('base64')
      const preference = getPreference(request)
      request.response.source.context.cookiePreference = preference
      request.response.source.context.currentPath = `${request.path}${request.url.search || ''}`
      request.response.source.context.cspNonce = cspNonce

      if (preference.confirmed && !preference.analytics) {
        clearAnalyticsCookies(request.response, request)
      }

      if (!request.response.headers['cache-control']) {
        request.response.header('cache-control', 'no-store')
      }
      request.response.header('content-security-policy', contentSecurityPolicy(cspNonce))
      return h.continue
    })
  }
}
