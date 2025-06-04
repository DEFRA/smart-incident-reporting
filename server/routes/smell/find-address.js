import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import config from '../../utils/config.js'
import { post as postRequest } from '../../utils/util.js'

const postcodeRegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?\d[A-Za-z0-9]? ?\d[A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/ // https://stackoverflow.com/a/51885364
const captchaSiteKey = config.captchaSiteKey

// Put these somewhere more sensible
const captchaVerifyUrl = 'https://global.frcapi.com/api/v2/captcha/siteverify'
const friendlyCaptchaEnabled = true // FIXME

const handlers = {
  get: async (request, h) => {
    const counterVal = request.yar.get(constants.redisKeys.COUNTER)

    // set counterVal value to zero on first page load
    if (!counterVal) {
      request.yar.set(constants.redisKeys.COUNTER, 0)
    }
    return h.view(constants.views.SMELL_FIND_ADDRESS, {
      ...getContext(request),
      enterAddress: constants.routes.SMELL_LOCATION_ADDRESS,
      captchaSiteKey,
      friendlyCaptchaEnabled
    })
  },
  post: async (request, h) => {
    console.log('---CAPTCHA---')
    const captchaResponse = request.payload['frc-captcha-response']
    let captchaSuccess = true // FIXME this needed as the else in the following if, find a nicer way

    if (captchaResponse) {
      console.log(`Captcha response: ${captchaResponse}`)
      console.log('Verifying response with external API ...')

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
      console.log(`Success: ${captchaVerifyResponse.success}`)
    } else {
      console.log('No response from Captcha, ignoring')
    }
    console.log('---END CAPTCHA---')

    let { buildingDetails, postcode } = request.payload

    // cleanse postcode for special characters https://design-system.service.gov.uk/patterns/addresses/#allow-different-postcode-formats
    if (postcode) {
      postcode = postcode.replace(/[^\w\s]/gi, '')
    }

    // validate payload
    const errorSummary = validatePayload(buildingDetails, postcode, captchaSuccess)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_FIND_ADDRESS, {
        errorSummary,
        ...request.payload,
        enterAddress: constants.routes.SMELL_LOCATION_ADDRESS,
        captchaSiteKey,
        friendlyCaptchaEnabled
      })
    }

    const counterVal = request.yar.get(constants.redisKeys.COUNTER)
    request.yar.set(constants.redisKeys.COUNTER, counterVal + 1)

    // handle redirects
    const counterLimit = 100000 // FIXME: CORRECT THIS, for debugging

    if (counterVal > counterLimit) {
      return h.redirect(constants.routes.SMELL_EXCEEDED_ATTEMPTS)
    } else {
      request.yar.set(constants.redisKeys.SMELL_FIND_ADDRESS, buildAnswers(buildingDetails, postcode))
      return h.redirect(constants.routes.SMELL_CHOOSE_ADDRESS)
    }
  }
}

const getContext = (request) => {
  const answers = request.yar.get(constants.redisKeys.SMELL_FIND_ADDRESS)
  const buildingDetails = answers?.buildingDetails || ''
  const postcode = answers?.postcode || ''
  return {
    buildingDetails,
    postcode
  }
}

const validatePayload = (buildingDetails, postcode, captchaSuccess) => {
  const errorSummary = getErrorSummary()
  if (!captchaSuccess) {
    errorSummary.errorList.push({
      text: 'Failed Captcha check',
      href: '#' // FIXME: add this
    })
  }

  if (!buildingDetails) {
    errorSummary.errorList.push({
      text: 'Enter a building number or name',
      href: '#buildingDetails'
    })
  }

  if (!postcode) {
    errorSummary.errorList.push({
      text: 'Enter an postcode',
      href: '#postcode'
    })
  } else if (!postcodeRegExp.test(postcode)) {
    errorSummary.errorList.push({
      text: 'Enter a full postcode, for example W1 8QS',
      href: '#postcode'
    })
  } else {
    // do nothing
  }
  return errorSummary
}

const buildAnswers = (buildingDetails, postcode) => ({
  buildingDetails,
  postcode
})

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_FIND_ADDRESS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_FIND_ADDRESS,
    handler: handlers.post
  }
]
