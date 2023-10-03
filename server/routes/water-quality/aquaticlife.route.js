'use strict'

const { Paths, Views, WQRedisKeys, WQSirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_AQUATICLIFE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      WQRedisKeys.WQ_SEEN_DEAD_FISH,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)

    return h.view(Views.WATER_TYPE_AQUATICLIFE_TWO, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const deadFish = payload.deadfish
  var deadFishValue
  if (deadFish === 'yes') {
    deadFishValue = true
  } else if (deadFish === 'no') {
    deadFishValue = false
  }

  RedisService.set(
    request,
    WQSirpRedisKeys.WQ_SIRP_SEEN_DEAD_FISH,
    JSON.stringify(deadFishValue)
  )
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
    path: `${Paths.WATER_TYPE_AQUATICLIFE}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_AQUATICLIFE}`,
    handler: handlers.post
  }
]
