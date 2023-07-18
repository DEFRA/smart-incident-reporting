'use strict'

const { Paths, Views, RedisKeys, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_CURRENT, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload

    if (payload.ongoing === undefined) {
      return h.view(Views.FISHING_CURRENT, {
        ...context
      })
    }

    RedisService.set(
      request,
      RedisKeys.FISHING_CURRENT_PAYLOAD,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    if (request.payload.ongoing === 'yes') {
      return h.view(Views.FISHING_OTHERINFO, {
        ...context
      })
    } else if (request.payload.ongoing === 'no') {
      return h.view(Views.FISHING_WHEN, {
        ...context
      })
    } else if (request.payload.ongoing === 'dunno') {
      return h.view(Views.FISHING_WHEN, {
        ...context
      })
    } else {
      return h.view(Views.FISHING_OTHERINFO, {
        ...context
      })
    }
  }
}

const _generateSirpData = (request, payload) => {
  const isItStillhappening = payload.ongoing
  var isItStillHappeningValue = 0
  if (isItStillhappening === 'yes') {
    isItStillHappeningValue = 100
  } else if (isItStillhappening === 'no') {
    isItStillHappeningValue = 200
  } else if (isItStillhappening === 'dunno') {
    isItStillHappeningValue = 300
  }

  RedisService.set(
    request,
    SirpRedisKeys.SIRP_FISHING_CURRENT_PAYLOAD,
    JSON.stringify(isItStillHappeningValue)
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
    path: `${Paths.FISHING_CURRENT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_CURRENT_ANSWER}`,
    handler: handlers.post
  }
]
