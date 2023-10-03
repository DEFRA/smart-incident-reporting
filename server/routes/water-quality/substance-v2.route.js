'use strict'

const { Paths, Views, WQSirpRedisKeys, WQRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_SUBSTANCE_V2, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      WQRedisKeys.WQ_WHAT_IS_IN_WATER,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)

    return h.view(Views.WATER_TYPE_SMELL_DESC, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  var whatIsInTheWaterValue
  if (payload.sewage !== undefined) {
    whatIsInTheWaterValue = 100
  } else if (payload.sewage !== undefined) {
    whatIsInTheWaterValue = 200
  } else if (payload.chemical !== undefined) {
    whatIsInTheWaterValue = 300
  } else if (payload.rural !== undefined) {
    whatIsInTheWaterValue = 400
  } else if (payload.refuse !== undefined) {
    whatIsInTheWaterValue = 500
  } else if (payload.contact !== undefined) {
    whatIsInTheWaterValue = 600
  } else if (payload['waterquality-substance'] !== undefined) {
    whatIsInTheWaterValue = 700
  }

  if (whatIsInTheWaterValue !== undefined) {
    RedisService.set(
      request,
      WQSirpRedisKeys.WQ_SIRP_WHAT_IS_IN_WATER,
      JSON.stringify(whatIsInTheWaterValue)
    )
  }

  if (payload.substance !== undefined && payload.substance !== ' ') {
    RedisService.set(
      request,
      WQSirpRedisKeys.WQ_SIRP_WHAT_IS_IN_WATER_OTHER,
      payload.substance
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
    path: `${Paths.WATER_TYPE_SUBSTANCE_V2}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_SUBSTANCE_V2}`,
    handler: handlers.post
  }
]
