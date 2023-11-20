'use strict'

const { Paths, Views, WQSirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_EXTENT_THREE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload

    _generateSirpData(request, payload)

    return h.view(Views.WATER_TYPE_AQUATICLIFE, {
      ...context
    })
  }
}

const _generateSirpData = async (request, payload) => {
  const pollutionWidth = payload['event-name']

  // set it only if defined
  if (pollutionWidth) {
    RedisService.set(
      request,
      WQSirpRedisKeys.WQ_SIRP_HOW_FAR_ALONG,
      pollutionWidth
    )
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
    path: `${Paths.WATER_TYPE_EXTENT_THREE}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_EXTENT_THREE}`,
    handler: handlers.post
  }
]
