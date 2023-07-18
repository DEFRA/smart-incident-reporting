'use strict'

const { Paths, Views, RedisKeys, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_CAUGHTORKILLED, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_CAUGHTORKILLED_PAYLOAD,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    if (request.payload.fishtaken === 'yes') {
      return h.view(Views.FISHING_TYPE_OF_FISH, {
        ...context
      })
    } else if (request.payload.fishtaken === 'no') {
      return h.view(Views.FISHING_NUMBER_OF_ANGLERS, {
        ...context
      })
    }
  }
}

const _generateSirpData = (request, payload) => {
  let isFishTaken
  const fishTakenValue = payload.fishtaken
  if (fishTakenValue !== undefined) {
    if (fishTakenValue === 'yes') {
      isFishTaken = true
    } else if (fishTakenValue === 'no') {
      isFishTaken = false
    }

    RedisService.set(
      request,
      SirpRedisKeys.SIRP_FISHING_CAUGHTORKILLED_PAYLOAD,
      JSON.stringify(isFishTaken)
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
    path: `${Paths.FISHING_CAUGHTORKILLED}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_CAUGHTORKILLED_ANSWER}`,
    handler: handlers.post
  }
]
