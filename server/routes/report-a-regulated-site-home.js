import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = getContext()
    return h.view(constants.views.REPORT_A_REGULATED_SITE_HOME, {
      ...context
    })
  }
}

const getContext = () => {
  return {
    startHref: constants.routes.HOME
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_A_REGULATED_SITE_HOME,
    handler: handlers.get
  }
]
