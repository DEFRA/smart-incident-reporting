import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const type = request.query.type
    const context = getContext(type)
    return h.view(constants.views.REPORT_A_REGULATED_SITE_START, {
      ...context
    })
  }
}

const getContext = (type) => {
  const context = {
    hideBackLink: true,
    type
  }

  return context
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_A_REGULATED_SITE_START,
    handler: handlers.get
  }
]
