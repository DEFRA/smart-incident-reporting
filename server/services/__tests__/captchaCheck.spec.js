jest.mock('../../../server/utils/util', () => ({
  post: jest.fn()
}))

describe('captchaCheck', () => {
  let captchaCheck
  let util

  const doImports = async () => {
    captchaCheck = (await import('../captchaCheck.js')).default
    util = (await import('../../utils/util.js')).default
  }

  beforeEach(async () => {
    jest.resetModules()
  })

  describe('validate ', () => {
    it('should return true if received captcha response is valid', async () => {
      await doImports()
      util.post.mockResolvedValueOnce({ success: true })

      const result = await captchaCheck.validate('a-valid-response', undefined)
      expect(result).toEqual(true)
      expect(util.post).toHaveBeenCalledTimes(1)
    })

    it('should return false if received captcha response is invalid', async () => {
      await doImports()
      util.post.mockResolvedValueOnce({ success: false })

      const result = await captchaCheck.validate('an-invalid-response', undefined)
      expect(result).toEqual(false)
      expect(util.post).toHaveBeenCalledTimes(1)
    })

    it('should return false if received captcha response was undefined', async () => {
      await doImports()
      const result = await captchaCheck.validate(undefined, undefined)
      expect(result).toEqual(false)
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return true if received captcha response was undefined but valid bypass key provided', async () => {
      await doImports()
      const result = await captchaCheck.validate(undefined, 'testcaptchabypasskey')
      expect(result).toEqual(true)
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return false if received captcha response was undefined but invalid bypass key provided', async () => {
      await doImports()
      const result = await captchaCheck.validate(undefined, 'notthetestcaptchabypasskey')
      expect(result).toEqual(false)
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return false if captcha response, env captcha bypass key and provided bypass key are all undefined', async () => {
      process.env.CAPTCHA_BYPASS_KEY = undefined
      await doImports()
      const result = await captchaCheck.validate(undefined, undefined)
      expect(result).toEqual(false)
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return true if error thrown when posting to captcha API', async () => {
      await doImports()
      util.post.mockRejectedValueOnce(new Error('error'))

      const result = await captchaCheck.validate('a-response-to-check', undefined)
      expect(result).toEqual(true)
      expect(util.post).toHaveBeenCalledTimes(1)
    })
  })
})
