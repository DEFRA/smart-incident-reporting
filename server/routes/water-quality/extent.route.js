'use strict'

const { Paths, Views, WQSirpRedisKeys, WQRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_EXTENT, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload
    RedisService.set(
      request,
      WQRedisKeys.WQ_HOW_FAR_ACROSS,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    return h.view(Views.WATER_TYPE_EXTENT_THREE, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const pollutionWidth = payload['pollution-width']
  var pollutionWidthValue = ''
  if (pollutionWidth === 'all') {
    pollutionWidthValue = 100
  } else if (pollutionWidth === 'half') {
    pollutionWidthValue = 200
  } else if (pollutionWidth === 'oneside') {
    pollutionWidthValue = 300
  } else if (pollutionWidth === 'onebank') {
    pollutionWidthValue = 400
  } else if (pollutionWidth === 'dunno') {
    pollutionWidthValue = 500
  }

  RedisService.set(
    request,
    WQSirpRedisKeys.WQ_SIRP_HOW_FAR_ACROSS,
    JSON.stringify(pollutionWidthValue)
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
    path: `${Paths.WATER_TYPE_EXTENT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_EXTENT}`,
    handler: handlers.post
  }
]
