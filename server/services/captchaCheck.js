import { post as postRequest } from '../utils/util.js'
import config from '../utils/config.js'

const captchaVerifyUrl = 'https://global.frcapi.com/api/v2/captcha/siteverify'

const validateSubmission = async (payload = {}, previouslyCompleted = false) => {
  if (previouslyCompleted) {
    return 'success'
  }

  if (!config.captchaEnabled || payload.javascriptEnabled !== 'true') {
    return 'not completed'
  }

  const captchaStatus = await validate(payload['frc-captcha-response'], payload.captchaBypassKey)
  return captchaStatus === 'unavailable' ? 'not completed' : captchaStatus
}

const validate = async (captchaResponse, payloadCaptchaBypassKey) => {
  if (payloadCaptchaBypassKey && payloadCaptchaBypassKey === config.captchaBypassKey) {
    return 'success'
  }

  if (captchaResponse) {
    try {
      const captchaVerifyResponse = await postRequest(
        captchaVerifyUrl,
        {
          headers: {
            'X-API-Key': config.captchaApiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          payload: {
            response: captchaResponse,
            sitekey: config.captchaSiteKey
          },
          json: true
        }
      )

      return captchaVerifyResponse.success ? 'success' : 'failed'
    } catch (error) {
      console.log('Error: failed to validate captcha against API')
      console.log(error)
      return 'unavailable'
    }
  }

  return 'failed'
}

export default {
  validate,
  validateSubmission
}
