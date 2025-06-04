describe('utils/config', () => {
  it('Should load successfully with valid environment variables', () => {
    jest.isolateModules(() => {
      expect(() => require('../config.js')).not.toThrow()
    })
  })
  it('Should fail to load if invalid config exists', () => {
    jest.isolateModules(() => {
      process.env.SERVICE_PORT = 'sdfdsfdsf'
      expect(() => require('../config.js')).toThrow('The server config is invalid. "servicePort" must be a number')
    })
  })
  it('Should set captcha API and site key if captcha enabled', () => {
    jest.isolateModules(() => {
      const apiKey = '1234'
      const siteKey = 'abcd'

      process.env.CAPTCHA_ENABLED = 'true'
      process.env.CAPTCHA_API_KEY = apiKey
      process.env.CAPTCHA_SITE_KEY = siteKey

      const config = require('../config.js')
      expect(config.default.captchaApiKey).toBe(apiKey)
      expect(config.default.captchaSiteKey).toBe(siteKey)
    })
  })
  it('Should set captcha API and site key to empty if captcha disabled', () => {
    jest.isolateModules(() => {
      process.env.CAPTCHA_ENABLED = 'false'
      const config = require('../config.js')
      expect(config.default.captchaApiKey).toBe('')
      expect(config.default.captchaSiteKey).toBe('')
    })
  })
})
