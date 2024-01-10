import constants from '../../utils/constants.js'
import redisService from '../../services/redis.service.js'

const handlers = {
  get: (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.WATER_TYPE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    redisService.set(
      request,
      constants.WQRedisKeys.WATER_TYPE,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    return h.view(constants.views.WATER_TYPE_LOCATION_MAP_OR_DESC, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const pollutionWaterType = payload['pollution-watertype']
  let pollutionWaterTypeValue = ''
  let waterFeatureOther
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

  redisService.set(
    request,
    constants.WQSirpRedisKeys.SIRP_WATER_TYPE,
    JSON.stringify(pollutionWaterTypeValue)
  )

  if (waterFeatureOther !== undefined) {
    redisService.set(
      request,
      constants.WQSirpRedisKeys.SIRP_WATER_FEATURE_OTHER,
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

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_TYPE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_TYPE,
    handler: handlers.post
  }
]
