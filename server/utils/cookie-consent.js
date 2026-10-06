const preferencesSetCookie = 'cookies_preferences_set'
const settingsCookie = 'cookies_settings'
const analyticsCookiePattern = /^_ga($|_)|^_gid$|^_gat($|_)|^_dc_gtm_/
const preferenceTtl = 365 * 24 * 60 * 60 * 1000

const decodeCookie = value => {
  try {
    return decodeURIComponent(Buffer.from(value, 'base64').toString())
  } catch {
    return null
  }
}

const getAnalyticsPreference = request => {
  if (decodeCookie(request.state?.[preferencesSetCookie]) !== 'true') return null
  try {
    const analytics = JSON.parse(decodeCookie(request.state[settingsCookie]))?.analytics
    return ['on', 'off'].includes(analytics) ? analytics : null
  } catch {
    return null
  }
}

const setAnalyticsPreference = (h, accepted) => {
  const options = { isHttpOnly: false, isSecure: false, path: '/', sameSite: 'Strict', ttl: preferenceTtl }
  const encode = value => Buffer.from(encodeURIComponent(value)).toString('base64')
  h.state(settingsCookie, encode(JSON.stringify({ analytics: accepted ? 'on' : 'off' })), options)
  h.state(preferencesSetCookie, encode('true'), options)
}

const clearAnalyticsCookies = (response, request) => {
  const names = Object.keys(request.state || {}).filter(name => analyticsCookiePattern.test(name))
  const hostname = request.info.hostname
  const parts = hostname.split('.')
  const domains = new Set([hostname, `.${hostname}`])
  parts.slice(1, -1).forEach((_part, index) => domains.add(`.${parts.slice(index + 1).join('.')}`))

  names.forEach(name => {
    const expiredCookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`
    response.header('set-cookie', expiredCookie, { append: true })
    domains.forEach(domain => {
      response.header('set-cookie', `${expiredCookie}; Domain=${domain}`, { append: true })
    })
  })
}

export { getAnalyticsPreference, setAnalyticsPreference, clearAnalyticsCookies }
