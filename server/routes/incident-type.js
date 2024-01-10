import constants from '../utils/constants.js'

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(constants.views.INCIDENT_TYPE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const incidenttype = request.payload['incident-type']

    request.yar.set(constants.RedisKeys.INCIDENT_TYPE, incidenttype)

    if (incidenttype === 'waterpollution') {
      return h.redirect(constants.routes.WATER_TYPE, { ...context })
    } else if (incidenttype === 'smells') {
      return h.redirect(constants.routes.WATER_TYPE, { ...context })
    } else if (incidenttype === 'fishing') {
      return h.redirect(constants.routes.FISHING_LOCATION, { ...context })
    }
    return h.view(constants.views.INCIDENT_TYPE, { ...context })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: true
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.INCIDENT_TYPE,
    handler: handlers.get
  }, {
    method: 'POST',
    path: constants.routes.INCIDENT_TYPE,
    handler: handlers.post
  }
]
