import constants from '../utils/constants.js'
import { setAnalyticsPreference } from '../utils/cookie-consent.js'

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(constants.views.COOKIES, {
      ...context,
      showSuccessBanner: request.query?.updated === 'true'
    })
  },
  post: (request, h) => {
    const preference = request.payload?.analytics
    const accepted = ['true', 'Yes'].includes(preference)
    if (!accepted && !['false', 'No'].includes(preference)) {
      return h.response('Invalid cookie preference').code(constants.statusCodes.BAD_REQUEST)
    }

    setAnalyticsPreference(h, accepted)
    return h.redirect(`${constants.routes.COOKIES}?updated=true`)
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: false
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.COOKIES,
    handler: handlers.get,
    options: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: constants.routes.COOKIES,
    handler: handlers.post,
    options: {
      auth: false
    }
  }
]
