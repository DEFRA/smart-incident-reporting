import captchaCheck from '../captchaCheck.js'
import util from '../../utils/util.js'

jest.mock('../../../server/utils/util', () => ({
  post: jest.fn()
}))

describe('captchaCheck', () => {
  describe('validate ', () => {
    it('should return true if received captcha response is valid', async () => {
      util.post.mockResolvedValueOnce({ success: true })

      const result = await captchaCheck.validate('a-valid-response')
      expect(result).toEqual(true)
      expect(util.post).toHaveBeenCalledTimes(1)
    })

    it('should return false if received captcha response is invalid', async () => {
      util.post.mockResolvedValueOnce({ success: false })

      const result = await captchaCheck.validate('an-invalid-response')
      expect(result).toEqual(false)
      expect(util.post).toHaveBeenCalledTimes(1)
    })

    it('should return true if received captcha response was undefined', async () => {
      const result = await captchaCheck.validate(undefined)
      expect(result).toEqual(true)
      expect(util.post).toHaveBeenCalledTimes(0)
    })

    it('should return true if error thrown when posting to captcha API', async () => {
      util.post.mockRejectedValueOnce(new Error('error'))

      const result = await captchaCheck.validate('a-response-to-check')
      expect(result).toEqual(true)
      expect(util.post).toHaveBeenCalledTimes(1)
    })
  })
})
