import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_RIVER, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { isRiver } = request.payload

    // validate payload
    const errorSummary = validatePayload(isRiver)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_RIVER, {
        ...getContext(request),
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.BLOCKAGE_RIVER, {
      isBlockageInRiver: isRiver === 'yes'
    })

    // handle redirects
    if (isRiver === 'yes') {
      return h.redirect(constants.routes.BLOCKAGE_RIVER_NAME)
    } else {
      return h.redirect(constants.routes.BLOCKAGE_REPORT_DIRECTLY)
    }
  }
}

const getContext = request => {
  const data = request.yar.get(constants.redisKeys.BLOCKAGE_RIVER)
  const isRiver = data?.isBlockageInRiver
  return {
    isRiver
  }
}

const validatePayload = isRiver => {
  const errorSummary = getErrorSummary()
  if (!isRiver) {
    errorSummary.errorList.push({
      text: 'Select yes if the blockage is in a river',
      href: '#isRiver'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_RIVER,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_RIVER,
    handler: handlers.post
  }
]
