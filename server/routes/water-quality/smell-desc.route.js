'use strict'

const {
  Paths,
  Views,
  RedisKeys,
  WQSirpRedisKeys
} = require('../../utils/constants')

const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_SMELL_DESC, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload

    _generateSirpData(request, payload)

    return h.view(Views.WATER_TYPE_SOURCE, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const pollutionSource = payload['waterquality-source']
  let pollutionSourceValue
  if (pollutionSource === 'yes') {
    pollutionSourceValue = true
  } else if (pollutionSource === 'no') {
    pollutionSourceValue = false
  }

  RedisService.set(
    request,
    WQSirpRedisKeys.WQ_SIRP_SMELL_SOURCE,
    JSON.stringify(pollutionSourceValue)
  )

  const pollutionSourceOther = payload['smell-details']

  if (pollutionSourceOther !== undefined && pollutionSourceOther !== ' ') {
    RedisService.set(
      request,
      WQSirpRedisKeys.WQ_SIRP_SMELL_SOURCE_OTHER,
      pollutionSourceOther
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
    path: `${Paths.WATER_TYPE_SMELL_DESC}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_SMELL_DESC}`,
    handler: handlers.post
  }
]
