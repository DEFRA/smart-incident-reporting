import constants from '../../utils/constants.js'
import { getErrorSummary, validateEmail } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_YOUR_DETAILS, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { fullName, phone, email } = request.payload
    const errorSummary = validatePayload(fullName, phone, email)

    // Validation error so return view in Error state
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_YOUR_DETAILS, {
        errorSummary,
        ...request.payload
      })
    }

    const { reporterAccessCode } = request.yar.get(constants.redisKeys.HOME)

    request.yar.set(constants.redisKeys.HOME, {
      reporterName: fullName,
      reporterPhoneNumber: phone,
      reporterEmailAddress: email,
      reporterAccessCode
    })

    // handle redirects
    return h.redirect(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
  }
}

const getContext = request => {
  const {
    reporterName: fullName,
    reporterPhoneNumber: phone,
    reporterEmailAddress: email
  } = request.yar.get(constants.redisKeys.HOME)

  return {
    fullName,
    phone,
    email
  }
}

const validatePayload = (fullName, phone, email) => {
  const errorSummary = getErrorSummary()
  if (!fullName) {
    errorSummary.errorList.push({
      text: 'Enter your name',
      href: '#fullName'
    })
  }
  if (!phone) {
    errorSummary.errorList.push({
      text: 'Enter a phone number',
      href: '#phone'
    })
  } else if (!constants.phoneRegex.test(phone)) {
    errorSummary.errorList.push({
      text: 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192',
      href: '#phone'
    })
  } else {
    // do nothing; sonarcloud has lost the plot.
  }
  if (!validateEmail(email)) {
    errorSummary.errorList.push({
      text: 'Enter an email address in the correct format, like name@example.com',
      href: '#email'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_YOUR_DETAILS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_YOUR_DETAILS,
    handler: handlers.post
  }
]
