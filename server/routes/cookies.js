import constants from '../utils/constants.js'
import { setPreference } from '../utils/cookie-consent.js'

const handlers = {
  get: (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.COOKIES, {
      ...context
    })
  },
  post: (request, h) => {
    if (!request.payload || !['true', 'false'].includes(request.payload.analytics)) {
      return h.response('Invalid cookie preference').code(constants.statusCodes.BAD_REQUEST)
    }

    setPreference(h, request.payload.analytics === 'true')

    const returnUrl = request.payload?.returnUrl
    if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
      return h.redirect(returnUrl)
    }

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
