'use strict'

const { Paths, Views, RedisKeys, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_TYPE_OF_FISH, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_TYPEOFFISH_PAYLOAD,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    return h.view(Views.FISHING_NUMBER_OF_FISH, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const typeOfFishValues = []
  const typesOfFish = payload['fish-type']
  if (Array.isArray(typesOfFish)) {
    let i = 0
    while (i < typesOfFish.length) {
      typeOfFishValues.push(_getTypeOfFishMappedValue(typesOfFish[i]))
      i++
    }
  } else {
    typeOfFishValues.push(_getTypeOfFishMappedValue(typesOfFish))
  }

  RedisService.set(
    request,
    SirpRedisKeys.SIRP_FISHING_TYPEOFFISH_PAYLOAD,
    JSON.stringify(typeOfFishValues)
  )
}

const _getTypeOfFishMappedValue = (typeOfFish) => {
  if (typeOfFish === 'salmon') {
    return 100
  } else if (typeOfFish === 'lamprey') {
    return 200
  } else if (typeOfFish === 'seatrout') {
    return 300
  } else if (typeOfFish === 'coarse') {
    return 400
  } else if (typeOfFish === 'other') {
    return 500
  } else if (typeOfFish === 'dunno') {
    return 600
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
    path: `${Paths.FISHING_TYPE_OF_FISH}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_TYPE_OF_FISH_ANSWER}`,
    handler: handlers.post
  }
]
