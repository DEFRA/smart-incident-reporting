import {
  clearAnalyticsCookies,
  consentCookieNames,
  getPreference,
  setPreference
} from '../cookie-consent.js'

const encodeCookie = value => Buffer.from(encodeURIComponent(value)).toString('base64')

describe('cookie consent utilities', () => {
  it('returns an unconfirmed opt-out preference when consent cookies are absent', () => {
    expect(getPreference({ state: {} })).toEqual({ confirmed: false, analytics: false })
  })

  it('reads an accepted preference', () => {
    expect(getPreference({
      state: {
        [consentCookieNames.preferencesSet]: encodeCookie('true'),
        [consentCookieNames.settings]: encodeCookie(JSON.stringify({ analytics: 'on' }))
      }
    })).toEqual({ confirmed: true, analytics: true })
  })

  it('treats malformed cookie values as opt-out', () => {
    expect(getPreference({
      state: {
        [consentCookieNames.preferencesSet]: 'not-base64',
        [consentCookieNames.settings]: encodeCookie('{')
      }
    })).toEqual({ confirmed: false, analytics: false })
  })

  it('writes an opt-out preference with the expected cookie options', () => {
    const state = jest.fn()
    setPreference({ state }, false)

    expect(state).toHaveBeenCalledTimes(2)
    expect(state.mock.calls[0][0]).toBe(consentCookieNames.settings)
    expect(state.mock.calls[0][1]).toBe(encodeCookie(JSON.stringify({ analytics: 'off' })))
    expect(state.mock.calls[0][2]).toMatchObject({ path: '/', sameSite: 'Strict' })
  })

  it('clears the analytics cookies present in the request', () => {
    const header = jest.fn()
    clearAnalyticsCookies({ header }, { state: { _ga: 'value', _ga_stream: 'value', unrelated: 'value' } })

    expect(header).toHaveBeenCalledTimes(2)
  })

  it('clears the standard analytics cookie names when none are present', () => {
    const header = jest.fn()
    clearAnalyticsCookies({ header }, { state: {} })

    expect(header).toHaveBeenCalledTimes(4)
  })
})
