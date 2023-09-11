'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_LOCATION_MAP_OR_DESC, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const locationmapordesc = request.payload['location-map-or-desc']
    if (locationmapordesc === 'address') {
      return h.view(Views.WATER_TYPE_LOCATION_ADDRESS_OPTION, { ...context })
    } else if (locationmapordesc === 'map') {
      return h.view(Views.WATER_TYPE_LOCATION_MAPPING_OPTION, { ...context })
    } else if (locationmapordesc === 'desc') {
      return h.view(Views.WATER_TYPE_LOCATION_DESC_OPTION, { ...context })
    }

    return h.view(Views.WATER_TYPE_LOCATION_MAP_OR_DESC, {
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
    path: `${Paths.WATER_TYPE_LOCATION_MAP_OR_DESC}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_LOCATION_MAP_OR_DESC}`,
    handler: handlers.post
  }
]
