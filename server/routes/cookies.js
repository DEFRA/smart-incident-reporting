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
      return h.response('Invalid cookie preference').code(400)
    }

    setPreference(h, request.payload.analytics === 'true')

    if (request.payload.returnUrl && request.payload.returnUrl.startsWith('/') && !request.payload.returnUrl.startsWith('//')) {
      return h.redirect(request.payload.returnUrl)
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
