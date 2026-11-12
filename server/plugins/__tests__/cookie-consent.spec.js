import cookieConsent from '../cookie-consent.js'
import { setAnalyticsPreference } from '../../utils/cookie-consent.js'

describe('cookie-consent plugin', () => {
  const expiryResponse = { header: jest.fn() }
  const continueSymbol = Symbol('continue')
  let onPreResponse

  beforeEach(() => {
    jest.clearAllMocks()
    cookieConsent.register({
      ext: (point, handler) => {
        expect(point).toBe('onPreResponse')
        onPreResponse = handler
      }
    })
  })

  it('expires GA cookies after a no-JavaScript opt-out submission', () => {
    const request = {
      path: '/cookies',
      method: 'post',
      payload: { analytics: 'No' },
      info: { hostname: 'sir.example.com' },
      state: { _ga: 'value' },
      response: expiryResponse
    }

    expect(onPreResponse(request, { continue: continueSymbol })).toBe(continueSymbol)
    expect(expiryResponse.header).toHaveBeenCalledWith('set-cookie', expect.stringContaining('_ga=; Max-Age=0'), { append: true })
  })

  it('expires GA cookies on later requests after saved opt-out', () => {
    const state = jest.fn()
    setAnalyticsPreference({ state }, false)
    const encodedPreferences = Object.fromEntries(state.mock.calls.map(([name, value]) => [name, value]))
    const request = {
      path: '/litter/source',
      method: 'get',
      info: { hostname: 'sir.example.com' },
      state: { ...encodedPreferences, _ga: 'value' },
      response: expiryResponse
    }

    onPreResponse(request, { continue: continueSymbol })

    expect(expiryResponse.header).toHaveBeenCalledWith('set-cookie', expect.stringContaining('_ga=; Max-Age=0'), { append: true })
  })

  it('does not expire GA cookies before a choice is saved', () => {
    onPreResponse({
      path: '/litter/source',
      method: 'get',
      info: { hostname: 'sir.example.com' },
      state: { _ga: 'value' },
      response: expiryResponse
    }, { continue: continueSymbol })

    expect(expiryResponse.header).not.toHaveBeenCalled()
  })
})
