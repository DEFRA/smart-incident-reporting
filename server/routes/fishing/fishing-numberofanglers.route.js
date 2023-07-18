'use strict'

const { Paths, Views, RedisKeys, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_NUMBER_OF_ANGLERS, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_NUMBEROFANGLERS_PAYLOAD,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    return h.view(Views.FISHING_CURRENT, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  let sirpHowManyAnglers
  const numberOfAnglers = payload['anglers-number']
  if (numberOfAnglers !== undefined) {
    if (numberOfAnglers === 'one') {
      sirpHowManyAnglers = false
    } else if (numberOfAnglers === 'more') {
      sirpHowManyAnglers = true
    }

    RedisService.set(
      request,
      SirpRedisKeys.SIRP_FISHING_NUMBEROFANGLERS_PAYLOAD,
      JSON.stringify(sirpHowManyAnglers)
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
    path: `${Paths.FISHING_NUMBER_OF_ANGLERS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_NUMBER_OF_ANGLERS_ANSWER}`,
    handler: handlers.post
  }
]
