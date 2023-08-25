'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')
const { findByPostcode } = require('../../services/incidentLocation')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_LOCATION, {
      ...context
    })
  },
  post: async (request, h) => {
    const context = _getContext()
    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_LOCATION_PAYLOAD,
      JSON.stringify(payload)
    )
    // get x,y coordinate
    const incidentCoordinates = await findByPostcode(payload.postcode)
    RedisService.set(
      request,
      RedisKeys.FISHING_INCIDENT_COORDINATES,
      JSON.stringify(incidentCoordinates)
    )

    const locationMappingPinpointFishing = request.payload['location-mapping-pinpoint-fishing']

    RedisService.set(
      request,
      RedisKeys.LOCATION_MAPPING_PINPOINT_FISHING,
      locationMappingPinpointFishing
    )

    if (locationMappingPinpointFishing === 'no') {
      return h.view(Views.FISHING_REPORTREASON, {
        ...context
      })
    } else {
      return h.view(Views.FISHING_LOCATION_MAPPING_OPTION, { ...context })
    }
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
    path: `${Paths.FISHING_LOCATION}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_LOCATION_ANSWER}`,
    handler: handlers.post
  }
]
