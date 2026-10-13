import { clearAnalyticsCookies, getAnalyticsPreference, setAnalyticsPreference } from '../cookie-consent.js'

const encodeCookie = value => Buffer.from(encodeURIComponent(value)).toString('base64')

describe('cookie consent utilities', () => {
  it('returns no preference when consent has not been confirmed', () => {
    expect(getAnalyticsPreference({ state: {} })).toBeNull()
  })

  it('reads a confirmed analytics opt-in', () => {
    expect(getAnalyticsPreference({
      state: {
        cookies_preferences_set: encodeCookie('true'),
        cookies_settings: encodeCookie(JSON.stringify({ analytics: 'on' }))
      }
    })).toBe('on')
  })

  it('reads a confirmed analytics opt-out', () => {
    expect(getAnalyticsPreference({
      state: {
        cookies_preferences_set: encodeCookie('true'),
        cookies_settings: encodeCookie(JSON.stringify({ analytics: 'off' }))
      }
    })).toBe('off')
  })

  it('ignores unrecognised analytics values', () => {
    expect(getAnalyticsPreference({
      state: {
        cookies_preferences_set: encodeCookie('true'),
        cookies_settings: encodeCookie(JSON.stringify({ analytics: 'maybe' }))
      }
    })).toBeNull()
  })

  it('ignores malformed preference cookies', () => {
    expect(getAnalyticsPreference({
      state: {
        cookies_preferences_set: encodeCookie('true'),
        cookies_settings: encodeCookie('{')
      }
    })).toBeNull()
  })

  it('writes both consent cookies with matching preference values', () => {
    const h = { state: jest.fn() }
    setAnalyticsPreference(h, false)
    expect(h.state).toHaveBeenCalledTimes(2)
    expect(h.state.mock.calls[0][0]).toBe('cookies_settings')
    expect(h.state.mock.calls[0][1]).toBe(encodeCookie(JSON.stringify({ analytics: 'off' })))
    expect(h.state.mock.calls[1][0]).toBe('cookies_preferences_set')
    expect(h.state.mock.calls[1][1]).toBe(encodeCookie('true'))
  })

  it('writes an opt-in value when analytics are accepted', () => {
    const h = { state: jest.fn() }
    setAnalyticsPreference(h, true)
    expect(h.state.mock.calls[0][1]).toBe(encodeCookie(JSON.stringify({ analytics: 'on' })))
  })

  it('does not set headers when the request has no cookie state', () => {
    const response = { header: jest.fn() }
    clearAnalyticsCookies(response, { info: { hostname: 'localhost' } })
    expect(response.header).not.toHaveBeenCalled()
  })

  it('expires GA cookies on host and parent domains', () => {
    const response = { header: jest.fn() }
    clearAnalyticsCookies(response, {
      info: { hostname: 'sir.test.example.com' },
      state: { _ga: 'value', _ga_stream: 'value', unrelated: 'value' }
    })
    const headers = response.header.mock.calls.map(([, value]) => value)
    expect(headers.some(value => value.startsWith('_ga=; Max-Age=0'))).toBe(true)
    expect(headers.some(value => value.includes('Domain=.example.com'))).toBe(true)
    expect(headers.some(value => value.includes('unrelated'))).toBe(false)
  })
})
