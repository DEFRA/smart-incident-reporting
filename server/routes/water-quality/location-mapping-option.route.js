'use strict'

const { Paths, Views, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_LOCATION_MAPPING_OPTION, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload

    const incidentCoordinates = {
      X_COORDINATE: Number(payload.mapx.substring(0, 5)),
      Y_COORDINATE: Number(payload.mapy.substring(0, 5))
    }

    // override incident co-ordinates with map pinpoint
    RedisService.set(
      request,
      SirpRedisKeys.WATER_INCIDENT_COORDINATES,
      JSON.stringify(incidentCoordinates)
    )
    return h.view(Views.WATER_TYPE_WHEN, {
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
    path: `${Paths.WATER_TYPE_LOCATION_MAPPING_OPTION}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_LOCATION_MAPPING_OPTION}`,
    handler: handlers.post
  }
]
