import constants from '../utils/constants.js'
import { setAnalyticsPreference } from '../utils/cookie-consent.js'

const returnPathFromReferer = request => {
  try {
    const referer = new URL(request.headers.referer)
    const path = referer.pathname.replace(/^\/+/, '/')
    if (path !== constants.routes.COOKIES) {
      return `${path}${referer.search}${referer.hash}`
    }
    return ''
  } catch {
    return ''
  }
}

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    const returnPath = returnPathFromReferer(request)
    if (returnPath) {
      request.yar.set('cookieReturnPath', returnPath)
    }
    return h.view(constants.views.COOKIES, {
      ...context,
      returnLink: request.yar.get('cookieReturnPath') || constants.urls.GOV_UK_SERVICE_HOME,
      showSuccessBanner: request.query?.updated === 'true'
    })
  },
  post: (request, h) => {
    const preference = request.payload?.cookieConsent ?? request.payload?.analytics
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
