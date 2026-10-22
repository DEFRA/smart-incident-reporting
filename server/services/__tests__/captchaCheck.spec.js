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
    it('should return success if received captcha response is valid', async () => {
      await doImports()
      util.post.mockResolvedValueOnce({ success: true })

      const result = await captchaCheck.validate('a-valid-response', undefined)
      expect(result).toEqual('success')
      expect(util.post).toHaveBeenCalledTimes(1)
    })

    it('should return failed if received captcha response is invalid', async () => {
      await doImports()
      util.post.mockResolvedValueOnce({ success: false })

      const result = await captchaCheck.validate('an-invalid-response', undefined)
      expect(result).toEqual('failed')
      expect(util.post).toHaveBeenCalledTimes(1)
    })

    it('should return failed if received captcha response was undefined', async () => {
      await doImports()
      const result = await captchaCheck.validate(undefined, undefined)
      expect(result).toEqual('failed')
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return success if received captcha response was undefined but valid bypass key provided', async () => {
      await doImports()
      const result = await captchaCheck.validate(undefined, 'testcaptchabypasskey')
      expect(result).toEqual('success')
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return failed if received captcha response was undefined but invalid bypass key provided', async () => {
      await doImports()
      const result = await captchaCheck.validate(undefined, 'notthetestcaptchabypasskey')
      expect(result).toEqual('failed')
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return failed if captcha response, env captcha bypass key and provided bypass key are all undefined', async () => {
      process.env.CAPTCHA_BYPASS_KEY = undefined
      await doImports()
      const result = await captchaCheck.validate(undefined, undefined)
      expect(result).toEqual('failed')
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return unavailable if error thrown when posting to captcha API', async () => {
      await doImports()
      util.post.mockRejectedValueOnce(new Error('error'))

      const result = await captchaCheck.validate('a-response-to-check', undefined)
      expect(result).toEqual('unavailable')
      expect(util.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('validateSubmission', () => {
    it('should return not completed when called with no arguments', async () => {
      await doImports()

      const result = await captchaCheck.validateSubmission()

      expect(result).toEqual('not completed')
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return success when captcha was completed earlier in the journey', async () => {
      await doImports()

      const result = await captchaCheck.validateSubmission({}, true)

      expect(result).toEqual('success')
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return not completed when JavaScript is not enabled', async () => {
      await doImports()

      const result = await captchaCheck.validateSubmission({ javascriptEnabled: 'false' })

      expect(result).toEqual('not completed')
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return success when the captcha response is valid', async () => {
      await doImports()
      util.post.mockResolvedValueOnce({ success: true })

      const result = await captchaCheck.validateSubmission({
        javascriptEnabled: 'true',
        'frc-captcha-response': 'a-valid-response'
      })

      expect(result).toEqual('success')
    })

    it('should return failed when the captcha response is invalid', async () => {
      await doImports()
      util.post.mockResolvedValueOnce({ success: false })

      const result = await captchaCheck.validateSubmission({
        javascriptEnabled: 'true',
        'frc-captcha-response': 'an-invalid-response'
      })

      expect(result).toEqual('failed')
    })

    it('should return failed when JavaScript is enabled but no captcha response is provided', async () => {
      await doImports()

      const result = await captchaCheck.validateSubmission({ javascriptEnabled: 'true' })

      expect(result).toEqual('failed')
      expect(util.post).not.toHaveBeenCalled()
    })

    it('should return not completed when the captcha API is unavailable', async () => {
      await doImports()
      util.post.mockRejectedValueOnce(new Error('error'))

      const result = await captchaCheck.validateSubmission({
        javascriptEnabled: 'true',
        'frc-captcha-response': 'a-response-to-check'
      })

      expect(result).toEqual('not completed')
    })
  })
})
