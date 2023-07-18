'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_OTHERINFO, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_OTHERINFO_PAYLOAD,
      JSON.stringify(payload)
    )
    return h.view(Views.ANONYMOUS, {
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
    path: `${Paths.FISHING_OTHERINFO}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_OTHERINFO_ANSWER}`,
    handler: handlers.post
  }
]
