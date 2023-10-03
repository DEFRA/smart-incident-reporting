'use strict'

const { Paths, Views, WQRedisKeys, WQSirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE, {
      ...context
    })
  },
  post: (request, h) => {

    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      WQRedisKeys.WATER_TYPE,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    return h.view(Views.WATER_TYPE_LOCATION_MAP_OR_DESC, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const pollutionWaterType = payload['pollution-watertype']
  var pollutionWaterTypeValue = ''
  var waterFeatureOther
  if (pollutionWaterType === 'river') {
    pollutionWaterTypeValue = 100
    waterFeatureOther = payload['river-name']
  } else if (pollutionWaterType === 'lake') {
    pollutionWaterTypeValue = 200
    waterFeatureOther = payload['lake-name']
  } else if (pollutionWaterType === 'reservoir') {
    pollutionWaterTypeValue = 300
    waterFeatureOther = payload['res-name']
  } else if (pollutionWaterType === 'sea') {
    pollutionWaterTypeValue = 400
  } else if (pollutionWaterType === 'stream') {
    pollutionWaterTypeValue = 500
  } else if (pollutionWaterType === 'water') {
    pollutionWaterTypeValue = 600
    waterFeatureOther = payload['other-source']
  } else if (pollutionWaterType === 'do-not-know') {
    pollutionWaterTypeValue = 700
  }

  RedisService.set(
    request,
    WQSirpRedisKeys.SIRP_WATER_TYPE,
    JSON.stringify(pollutionWaterTypeValue)
  )

  if (waterFeatureOther !== undefined) {
    RedisService.set(
      request,
      WQSirpRedisKeys.SIRP_WATER_FEATURE_OTHER,
      waterFeatureOther
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
    path: `${Paths.WATER_TYPE}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_ANSWER}`,
    handler: handlers.post
  }
]
