'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_LOCATION_MAPPING_OPTION, {
      ...context
    })
  },
  post: async (request, h) => {
    const context = _getContext()
    const payload = request.payload

    const incidentCoordinates = {
      X_COORDINATE: Number(payload.mapx.substring(0, 5)),
      Y_COORDINATE: Number(payload.mapy.substring(0, 5))
    }

    // override incident co-ordinates with map pinpoint
    RedisService.set(
      request,
      RedisKeys.FISHING_INCIDENT_COORDINATES,
      JSON.stringify(incidentCoordinates)
    )

    return h.view(Views.FISHING_REPORTREASON, {
      ...context
    })
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
    path: `${Paths.FISHING_LOCATION_PIN_POINT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_LOCATION_PIN_POINT}`,
    handler: handlers.post
  }
]
