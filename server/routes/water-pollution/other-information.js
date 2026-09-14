import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherInfo } = request.payload

    const errorSummary = validateOtherInfo(otherInfo)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION, {
        answers: otherInfo,
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION, otherInfo)
    return h.redirect(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
  }
}

const getContext = request => {
  const answers = request.yar.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION)
  return {
    answers
  }
}

const validateOtherInfo = otherInfo => {
  const errorSummary = getErrorSummary()
  if (maxLength(otherInfo, constants.otherInformationCharacterLimit)) {
    errorSummary.errorList.push({
      text: `Anything else you'd like to add must be ${constants.otherInformationCharacterLimit} characters or less`,
      href: '#otherInfo'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_OTHER_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_OTHER_INFORMATION,
    handler: handlers.post
  }
]
