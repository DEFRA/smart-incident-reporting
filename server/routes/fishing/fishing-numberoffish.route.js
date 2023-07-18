'use strict'

const { Paths, Views, RedisKeys, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_NUMBER_OF_FISH, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_NUMBEROFFISH_PAYLOAD,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    return h.view(Views.FISHING_NUMBER_OF_ANGLERS, {
      ...context
    })
  }
}
const _generateSirpData = (request, payload) => {
  let sirpHowManyIllegalFish
  const numberOfFish = payload['fish-number']
  if (numberOfFish !== undefined) {
    if (numberOfFish === 'more') {
      sirpHowManyIllegalFish = 100
    } else if (numberOfFish === 'less') {
      sirpHowManyIllegalFish = 200
    } else if (numberOfFish === 'dunno') {
      sirpHowManyIllegalFish = 300
    }

    RedisService.set(
      request,
      SirpRedisKeys.SIRP_FISHING_NUMBEROFFISH_PAYLOAD,
      JSON.stringify(sirpHowManyIllegalFish)
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
    path: `${Paths.FISHING_NUMBER_OF_FISH}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_NUMBER_OF_FISH_ANSWER}`,
    handler: handlers.post
  }
]
