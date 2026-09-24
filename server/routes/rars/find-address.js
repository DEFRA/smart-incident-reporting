import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import config from '../../utils/config.js'
import captchaCheck from '../../services/captchaCheck.js'

const { postcodeRegExp } = constants
const captchaEnabled = config.captchaEnabled
const captchaSiteKey = config.captchaSiteKey

const createFindAddressRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const handlers = {
    get: async (request, h) => {
      const counterVal = request.yar.get(constants.redisKeys.COUNTER)

      if (!counterVal) {
        request.yar.set(constants.redisKeys.COUNTER, 0)
      }

      return h.view(constants.views.RARS_FIND_ADDRESS, {
        ...serviceDetails,
        ...getContext(request),
        enterAddress: redirect.locationAddress,
        captchaSiteKey,
        captchaEnabled
      })
    },
    post: async (request, h) => {
      let { postcode } = request.payload
      const {
        buildingDetails,
        captchaBypassKey,
        'frc-captcha-response': captchaResponse
      } = request.payload

      if (postcode) {
        postcode = postcode.replace(/[^\w\s]/gi, '')
      }

      const captchaSuccess = await captchaCheck.validate(captchaResponse, captchaBypassKey)

      const errorSummary = validatePayload(postcode, captchaSuccess)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_FIND_ADDRESS, {
          errorSummary,
          ...request.payload,
          enterAddress: redirect.locationAddress,
          captchaSiteKey,
          captchaEnabled,
          ...serviceDetails
        })
      }

      const counterVal = request.yar.get(constants.redisKeys.COUNTER)
      request.yar.set(constants.redisKeys.COUNTER, counterVal + 1)

      const counterLimit = 10

      if (counterVal > counterLimit) {
        return h.redirect(redirect.exceededAttempts)
      } else {
        request.yar.set(constants.redisKeys.RARS_FIND_ADDRESS, buildAnswers(buildingDetails, postcode))
        return h.redirect(redirect.chooseAddress)
      }
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = (request) => {
  const answers = request.yar.get(constants.redisKeys.RARS_FIND_ADDRESS)
  const buildingDetails = answers?.buildingDetails || ''
  const postcode = answers?.postcode || ''
  return {
    buildingDetails,
    postcode
  }
}

const validatePayload = (postcode, captchaSuccess) => {
  const errorSummary = getErrorSummary()
  if (!captchaSuccess) {
    errorSummary.errorList.push({
      text: 'You cannot continue until Friendly Captcha has checked that you\'re not a robot',
      href: '#friendly-captcha'
    })
  }

  if (!postcode) {
    errorSummary.errorList.push({
      text: 'Enter a postcode',
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

export default createFindAddressRoutes
