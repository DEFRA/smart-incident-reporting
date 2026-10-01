const consentCookieNames = {
  preferencesSet: 'cookies_preferences_set',
  settings: 'cookies_settings'
}

const analyticsCookiePattern = /^_ga$|^_ga_.*$|^_gid$|^_gat_.*$|^_dc_gtm_.*$/

const encodeCookie = value => Buffer.from(encodeURIComponent(value)).toString('base64')

const decodeCookie = value => {
  try {
    return decodeURIComponent(Buffer.from(value, 'base64').toString())
  } catch {
    return null
  }
}

const getPreference = request => {
  const preferencesSet = decodeCookie(request.state[consentCookieNames.preferencesSet])
  const settings = decodeCookie(request.state[consentCookieNames.settings])
  let analytics = false

  if (settings) {
    try {
      analytics = JSON.parse(settings).analytics === 'on'
    } catch {
      analytics = false
    }
  }

  return {
    confirmed: preferencesSet === 'true',
    analytics
  }
}

const setPreference = (h, analytics) => {
  const cookieOptions = {
    isHttpOnly: false,
    isSecure: false,
    path: '/',
    sameSite: 'Strict',
    ttl: 365 * 24 * 60 * 60 * 1000
  }

  h.state(consentCookieNames.settings, encodeCookie(JSON.stringify({ analytics: analytics ? 'on' : 'off' })), cookieOptions)
  h.state(consentCookieNames.preferencesSet, encodeCookie('true'), cookieOptions)
}

const clearAnalyticsCookies = (response, request) => {
  const cookieNames = Object.keys(request.state).filter(cookieName => analyticsCookiePattern.test(cookieName))
  const names = cookieNames.length ? cookieNames : ['_ga', '_gid', '_gat', '_dc_gtm_']

  names.forEach(cookieName => {
    response.header('set-cookie', `${cookieName}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`, { append: true })
  })
}

export {
  consentCookieNames,
  getPreference,
  setPreference,
  clearAnalyticsCookies
}
