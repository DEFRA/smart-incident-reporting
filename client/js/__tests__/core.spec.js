jest.mock('../analytics.js', () => ({ __esModule: true, default: jest.fn() }))

describe('Google consent commands', () => {
  beforeEach(() => {
    global.window = {}
    global.document = {
      getElementsByClassName: jest.fn(() => []),
      querySelector: jest.fn(selector => selector === 'meta[name="analytics-account"]' ? { content: 'GTM-TEST' } : null),
      createElement: jest.fn(() => ({})),
      body: { appendChild: jest.fn() }
    }
    jest.spyOn(console, 'info').mockImplementation(() => {})
    jest.isolateModules(() => { require('../core.js') })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    delete global.window
    delete global.document
  })

  it('queues consent updates using the Google arguments format', () => {
    window.sir.utils.updateGoogleAnalyticsConsent(true)
    expect(Object.prototype.toString.call(window.dataLayer[0])).toBe('[object Arguments]')
  })

  it('grants analytics storage after acceptance', () => {
    window.sir.utils.updateGoogleAnalyticsConsent(true)
    expect(window.dataLayer[0][2].analytics_storage).toBe('granted')
  })

  it('denies analytics storage after accepting then rejecting', () => {
    window.sir.utils.updateGoogleAnalyticsConsent(true)
    window.sir.utils.updateGoogleAnalyticsConsent(false)
    expect(window.dataLayer[1][2].analytics_storage).toBe('denied')
  })

  it('queues default consent using the Google arguments format', () => {
    window.sir.utils.setupGoogleTagManager()
    const [script] = document.body.appendChild.mock.calls[0]
    script.onload()
    expect(Object.prototype.toString.call(window.dataLayer[0])).toBe('[object Arguments]')
  })
})
