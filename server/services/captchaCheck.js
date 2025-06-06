import { post as postRequest } from '../utils/util.js'
import config from '../utils/config.js'

const captchaVerifyUrl = 'https://global.frcapi.com/api/v2/captcha/siteverify'

const validate = async captchaResponse => {
  let captchaSuccess = true

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

      captchaSuccess = captchaVerifyResponse.success
    } catch (error) {
      // If we are unable to validate the captcha response, leave captchaSuccess as true so
      // that we don't stop the user from progressing in the case where the external API is down
      console.log('Error: failed to validate captcha against API')
      console.log(error)
    }
  }

  return captchaSuccess
}

export default {
  validate
}
