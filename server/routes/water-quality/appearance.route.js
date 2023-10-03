'use strict'

const { Paths, Views, WQRedisKeys, WQSirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_APPEARANCE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    const payload = request.payload

    RedisService.set(
      request,
      WQRedisKeys.WQ_WHAT_CAN_YOU_SEE,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)

    return h.view(Views.WATER_TYPE_SUBSTANCE_V2, {
      ...context
    })
  }
}
const _generateSirpData = (request, payload) => {
  const wqWhatCanYouSee = []
  const wcys = payload['waterquality-appearance']
  if (Array.isArray(wcys)) {
    let i = 0
    while (i < wcys.length) {
      wqWhatCanYouSee.push(_getWcysMappedValue(wcys[i]))
      i++
    }
  } else {
    wqWhatCanYouSee.push(_getWcysMappedValue(wcys))
  }

  RedisService.set(
    request,
    WQSirpRedisKeys.WQ_SIRP_WHAT_CAN_YOU_SEE,
    JSON.stringify(wqWhatCanYouSee)
  )
}

const _getWcysMappedValue = (wcysValue) => {
  if (wcysValue === 'cloudy') {
    return 100
  } else if (wcysValue === 'rainbow') {
    return 200
  } else if (wcysValue === 'streaked') {
    return 300
  } else if (wcysValue === 'scum') {
    return 400
  } else if (wcysValue === 'slimy') {
    return 500
  } else if (wcysValue === 'littered') {
    return 600
  } else if (wcysValue === 'other') {
    return 700
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
    path: `${Paths.WATER_TYPE_APPEARANCE}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_APPEARANCE}`,
    handler: handlers.post
  }
]
