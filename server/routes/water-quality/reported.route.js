'use strict'

const { Paths, Views, WQRedisKeys, WQSirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_REPORTED, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload
    const reported = payload.reported
    if (reported === undefined) {
      RedisService.set(
        request,
        WQRedisKeys.WQ_ADDRESS,
        JSON.stringify(payload)
      )
    } else {
      RedisService.set(
        request,
        WQRedisKeys.WQ_PREVIOUSLY_REPORTED,
        JSON.stringify(payload)
      )
    }
    _generateSirpData(request, payload)
    if (reported === 'yes') {
      return h.view(Views.WATER_TYPE_WHEN, { ...context })
    } else if (reported === 'no') {
      return h.view(Views.WATER_TYPE_RECURRING, { ...context })
    }

    return h.view(Views.WATER_TYPE_REPORTED, {
      ...context
    })
  }
}

const _generateSirpData = (request, payload) => {
  const wqAddress = {}

  const addressLine1 = payload['address-line-1']
  const addressLine2 = payload['address-line-2']
  const addressLineTown = payload['address-town']
  const addressLinePostCode = payload['address-postcode']

  if (payload.reported === undefined) {
    wqAddress.sirp_addressline1 = addressLine1
    wqAddress.sirp_addressline2 = addressLine2
    wqAddress.sirp_town = addressLineTown
    wqAddress.sirp_postcode = addressLinePostCode

    RedisService.set(
      request,
      WQSirpRedisKeys.WQ_SIRP_ADDRESS,
      JSON.stringify(wqAddress)
    )
  } else {
    RedisService.set(
      request,
      WQSirpRedisKeys.WQ_SIRP_PREVIOUSLY_REPORTED,
      JSON.stringify(payload.reported)
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
    path: `${Paths.WATER_TYPE_REPORTED}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_REPORTED}`,
    handler: handlers.post
  }
]
