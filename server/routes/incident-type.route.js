'use strict'

const { Paths, Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.INCIDENT_TYPE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    var incidenttype = request.payload['incident-type']
    console.log('Val : ' + incidenttype)
    if (incidenttype === 'waterpollution') {
      return h.view(Views.WATER_TYPE, { ...context })
    } else if (incidenttype === 'smells') {
      return h.view(Views.WATER_TYPE, { ...context })
    } else if (incidenttype === 'fishing') {
      return h.view(Views.FISHING_LOCATION, { ...context })
    }
    return h.view(Views.INCIDENT_TYPE, { ...context })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: true
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.INCIDENT_TYPE}`,
    handler: handlers.get
  }, {
    method: 'POST',
    path: `${Paths.WATER_TYPE}`,
    handler: handlers.post
  }
]
