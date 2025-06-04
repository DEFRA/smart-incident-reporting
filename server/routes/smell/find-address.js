import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import config from '../../utils/config.js'
import { post as postRequest } from '../../utils/util.js'

const postcodeRegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?\d[A-Za-z0-9]? ?\d[A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/ // https://stackoverflow.com/a/51885364
const captchaVerifyUrl = 'https://global.frcapi.com/api/v2/captcha/siteverify'
const captchaEnabled = config.captchaEnabled
const captchaSiteKey = config.captchaSiteKey

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
      captchaEnabled
    })
  },
  post: async (request, h) => {
    let { buildingDetails, postcode } = request.payload

    // cleanse postcode for special characters https://design-system.service.gov.uk/patterns/addresses/#allow-different-postcode-formats
    if (postcode) {
      postcode = postcode.replace(/[^\w\s]/gi, '')
    }

    const captchaResponse = request.payload['frc-captcha-response']
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

    // validate payload
    const errorSummary = validatePayload(buildingDetails, postcode, captchaSuccess)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_FIND_ADDRESS, {
        errorSummary,
        ...request.payload,
        enterAddress: constants.routes.SMELL_LOCATION_ADDRESS,
        captchaSiteKey,
        captchaEnabled
      })
    }

    const counterVal = request.yar.get(constants.redisKeys.COUNTER)
    request.yar.set(constants.redisKeys.COUNTER, counterVal + 1)

    // handle redirects
    const counterLimit = 10

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
      text: 'You cannot continue until Friendly Captcha has checked that you\'re not a robot',
      href: '#friendly-captcha'
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
