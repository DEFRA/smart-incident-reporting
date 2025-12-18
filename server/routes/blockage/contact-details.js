import constants from '../../utils/constants.js'
import { getErrorSummary, validateEmail } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_CONTACT_DETAILS, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { fullName = '', email = '', phone = '' } = request.payload || {}
    const errorSummary = validatePayload(phone, email)

    // Validation error so return view in Error state
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_CONTACT_DETAILS, {
        errorSummary,
        fullName,
        email,
        phone
      })
    }

    request.yar.set(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS, {
      detailsName: fullName || '',
      detailsPhone: phone || '',
      detailsEmail: email || ''
    })

    // handle redirects
    return h.redirect(constants.routes.BLOCKAGE_START)
  }
}

const getContext = request => {
  const yourDetails = request.yar.get(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS)
  const fullName = yourDetails?.detailsName || ''
  const phone = yourDetails?.detailsPhone || ''
  const email = yourDetails?.detailsEmail || ''

  return {
    fullName,
    phone,
    email
  }
}

const validatePayload = (phone, email) => {
  const errorSummary = getErrorSummary()
  if ((phone?.length > 0) && !constants.phoneRegex.test(phone)) {
    errorSummary.errorList.push({
      text: 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192',
      href: '#phone'
    })
  }

  if ((email?.length > 0) && !validateEmail(email)) {
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
    path: constants.routes.BLOCKAGE_CONTACT_DETAILS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_CONTACT_DETAILS,
    handler: handlers.post
  }
]
