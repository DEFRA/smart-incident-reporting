'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_WHEN, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_WHEN_PAYLOAD,
      JSON.stringify(payload)
    )
    return h.view(Views.FISHING_OTHERINFO, {
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
    path: `${Paths.FISHING_WHEN}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_WHEN_ANSWER}`,
    handler: handlers.post
  }
]
