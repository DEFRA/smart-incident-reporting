'use strict'

const { Paths, Views, WQRedisKeys, WQSirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_AQUATICLIFE_TWO, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      WQRedisKeys.WQ_HOW_MANY_DEAD_FISH,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)

    return h.view(Views.WATER_TYPE_OTHER_INFO, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const deadFish = payload.deadfish
  let deadFishValue
  if (deadFish === '20') {
    deadFishValue = 100
  } else if (deadFish === '10') {
    deadFishValue = 200
  } else if (deadFish === 'less') {
    deadFishValue = 300
  } else if (deadFish === 'dunno') {
    deadFishValue = 400
  }

  RedisService.set(
    request,
    WQSirpRedisKeys.WQ_SIRP_HOW_MANY_DEAD_FISH,
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
    path: `${Paths.WATER_TYPE_AQUATICLIFE_TWO}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_AQUATICLIFE_TWO}`,
    handler: handlers.post
  }
]
