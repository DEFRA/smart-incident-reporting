import cookieConsent from '../cookie-consent.js'

const encodeCookie = value => Buffer.from(encodeURIComponent(value)).toString('base64')

describe('cookie-consent plugin', () => {
  let onPreResponse

  beforeEach(() => {
    cookieConsent.register({
      ext: (point, handler) => {
        expect(point).toBe('onPreResponse')
        onPreResponse = handler
      }
    })
  })

  it('continues non-view responses without changing them', () => {
    const h = { continue: Symbol('continue') }
    const request = { response: { variety: 'response' } }

    expect(onPreResponse(request, h)).toBe(h.continue)
  })

  it('adds consent context and cache headers to view responses', () => {
    const response = {
      variety: 'view',
      source: { context: {} },
      headers: {},
      header: jest.fn()
    }
    const request = {
      path: '/cookies',
      url: { search: '?updated=true' },
      state: {
        cookies_preferences_set: encodeCookie('true'),
        cookies_settings: encodeCookie(JSON.stringify({ analytics: 'on' }))
      },
      response
    }
    const h = { continue: Symbol('continue') }

    expect(onPreResponse(request, h)).toBe(h.continue)
    expect(response.source.context).toEqual({
      cookiePreference: { confirmed: true, analytics: true },
      currentPath: '/cookies?updated=true',
      cspNonce: expect.any(String)
    })
    expect(response.header).toHaveBeenCalledWith('cache-control', 'no-store')
  })

  it('does not clear analytics cookies before consent is confirmed', () => {
    const response = {
      variety: 'view',
      source: { context: {} },
      headers: {},
      header: jest.fn()
    }
    const request = {
      path: '/',
      url: { search: '' },
      state: {},
      response
    }
    const h = { continue: Symbol('continue') }

    onPreResponse(request, h)

    expect(response.header).toHaveBeenCalledTimes(2)
    expect(response.header).toHaveBeenCalledWith('cache-control', 'no-store')
  })

  it('clears analytics cookies after a confirmed opt-out', () => {
    const response = {
      variety: 'view',
      source: { context: {} },
      headers: {},
      header: jest.fn()
    }
    const request = {
      path: '/',
      url: { search: '' },
      state: {
        cookies_preferences_set: encodeCookie('true'),
        cookies_settings: encodeCookie(JSON.stringify({ analytics: 'off' })),
        _ga: 'value'
      },
      response
    }
    const h = { continue: Symbol('continue') }

    onPreResponse(request, h)

    expect(response.header).toHaveBeenCalledWith('set-cookie', expect.stringContaining('_ga='), { append: true })
  })

  it.each(['connect-src', 'img-src'])('allows regional GA collection endpoints in %s', directive => {
    const response = {
      variety: 'view',
      source: { context: {} },
      headers: {},
      header: jest.fn()
    }
    const request = { path: '/', url: { search: '' }, state: {}, response }

    onPreResponse(request, { continue: Symbol('continue') })

    const [, policy] = response.header.mock.calls.find(([name]) => name === 'content-security-policy')
    const sources = policy.split('; ').find(value => value.startsWith(`${directive} `)).split(' ').slice(1)
    expect(sources).toContain('https://*.google-analytics.com')
  })
})
