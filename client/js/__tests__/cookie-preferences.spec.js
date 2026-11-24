describe('analytics acceptance and withdrawal', () => {
  const cookies = new Map()
  const writes = []
  const scripts = []
  const events = {}
  const originalGaId = process.env.GA_ID
  const encode = value => Buffer.from(encodeURIComponent(value)).toString('base64')
  const initialise = () => {
    jest.isolateModules(() => { require('../core.js') })
  }
  const savedPreference = preference => {
    cookies.set('cookies_preferences_set', encode('true'))
    cookies.set('cookies_settings', encode(JSON.stringify({ analytics: preference })))
  }

  beforeEach(() => {
    cookies.clear()
    writes.length = 0
    scripts.length = 0
    process.env.GA_ID = 'existing-container-id'
    global.window = {
      atob: value => Buffer.from(value, 'base64').toString(),
      btoa: value => Buffer.from(value).toString('base64'),
      location: { hostname: 'sir.test.example.com', reload: jest.fn(), assign: jest.fn() },
      scrollTo: jest.fn(),
      addEventListener: (name, handler) => { events[name] = handler }
    }
    global.document = {
      getElementsByClassName: () => [],
      querySelector: selector => {
        if (selector === '.js-cookie-banner-container') return { parentNode: { removeChild: jest.fn() } }
        if (selector === 'script[src*="googletagmanager.com/gtm.js"]') return scripts[0] || null
        return null
      },
      createElement: () => ({}),
      body: { appendChild: script => { scripts.push(script) } }
    }
    Object.defineProperty(document, 'cookie', {
      get: () => [...cookies].map(([name, value]) => `${name}=${value}`).join('; '),
      set: value => {
        writes.push(value)
        const [pair] = value.split(';')
        const separator = pair.indexOf('=')
        const name = pair.slice(0, separator)
        const contents = pair.slice(separator + 1)
        if (contents) cookies.set(name, contents)
        else cookies.delete(name)
      }
    })
  })

  afterEach(() => {
    delete global.window
    delete global.document
    if (originalGaId === undefined) delete process.env.GA_ID
    else process.env.GA_ID = originalGaId
  })

  it('loads the original configured ID on a journey page after acceptance', () => {
    savedPreference('on')
    initialise()
    expect(scripts[0].src).toBe('https://www.googletagmanager.com/gtm.js?id=existing-container-id')
  })

  it('does not initialize GTM before acceptance', () => {
    initialise()
    expect(scripts).toHaveLength(0)
  })

  it('deletes GA cookies immediately after withdrawal', () => {
    savedPreference('on')
    initialise()
    cookies.set('_ga', 'value')
    cookies.set('_ga_stream', 'value')
    window.sir.utils.savePreference(false)
    expect([...cookies.keys()].filter(name => name.startsWith('_ga'))).toEqual([])
  })

  it('expires GA cookies on parent domains', () => {
    initialise()
    cookies.set('_ga', 'value')
    window.sir.utils.savePreference(false)
    expect(writes).toContain('_ga=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=.example.com')
  })

  it('reloads after withdrawal to stop an already running GTM container', () => {
    savedPreference('on')
    initialise()
    window.sir.utils.savePreference(false)
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  it('keeps the confirmation visible after withdrawing on the cookies page', () => {
    savedPreference('on')
    initialise()
    const saveButton = { addEventListener: jest.fn() }
    const successBanner = { removeAttribute: jest.fn() }
    const querySelector = document.querySelector
    const elements = {
      '#continue-button': saveButton,
      'input[name="cookieConsent"]:checked': { value: 'No' },
      '#f-cookieConsent': {},
      '#successBanner': successBanner
    }
    document.querySelector = selector => elements[selector] ?? querySelector(selector)

    jest.isolateModules(() => { require('../pages/cookies.js') })
    expect(saveButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
    saveButton.addEventListener.mock.calls[0][1]({ preventDefault: jest.fn() })

    expect(window.location.assign).toHaveBeenCalledWith('/cookies?updated=true')
    expect(window.location.reload).not.toHaveBeenCalled()
    expect(successBanner.removeAttribute).toHaveBeenCalledWith('hidden')
  })

  it('does not load GTM on later journey pages after rejection', () => {
    savedPreference('off')
    initialise()
    expect(scripts).toHaveLength(0)
  })

  it('removes remaining GA cookies on later pages after rejection', () => {
    savedPreference('off')
    cookies.set('_ga', 'value')
    cookies.set('_gid', 'value')
    cookies.set('_gat', 'value')
    cookies.set('_dc_gtm_test', 'value')
    initialise()
    expect([...cookies.keys()]).toEqual(['cookies_preferences_set', 'cookies_settings'])
  })

  it('reloads restored pages after analytics has been rejected', () => {
    savedPreference('off')
    initialise()
    events.pageshow({ persisted: true })
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  it('does not reload restored pages while analytics remains accepted', () => {
    savedPreference('on')
    initialise()
    events.pageshow({ persisted: true })
    expect(window.location.reload).not.toHaveBeenCalled()
  })

  it('cleans GA cookies when returning to an accepted page after withdrawal', () => {
    savedPreference('on')
    initialise()
    savedPreference('off')
    cookies.set('_ga', 'value')
    events.pageshow({ persisted: true })
    expect(cookies.has('_ga')).toBe(false)
  })
})
