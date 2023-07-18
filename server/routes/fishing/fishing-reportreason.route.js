'use strict'

const { Paths, Views, RedisKeys, SirpRedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_REPORTREASON, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.FISHING_REPORTREASON_PAYLOAD,
      JSON.stringify(payload)
    )
    _generateSirpData(request, payload)
    if (request.payload.fishIllegality === 'location') {
      return h.view(Views.FISHING_CAUGHTORKILLED, {
        ...context
      })
    } else if (request.payload.fishIllegality === 'equipment') {
      return h.view(Views.FISHING_EQUIPMENT, {
        ...context
      })
    } else {
      return h.view(Views.FISHING_EQUIPMENT, {
        ...context
      })
    }
  }
}

const _generateSirpData = (request, payload) => {
  const reasonValues = []
  const reasons = payload.fishIllegality
  if (Array.isArray(reasons)) {
    let i = 0
    while (i < reasons.length) {
      reasonValues.push(_getReasonMappedValue(reasons[i]))
      i++
    }
  } else {
    reasonValues.push(_getReasonMappedValue(reasons))
  }

  RedisService.set(
    request,
    SirpRedisKeys.SIRP_FISHING_REPORTREASON_PAYLOAD,
    JSON.stringify(reasonValues)
  )
}

const _getReasonMappedValue = (reasonValue) => {
  if (reasonValue === 'location') {
    return 100
  } else if (reasonValue === 'equipment') {
    return 200
  } else if (reasonValue === 'licence') {
    return 300
  } else if (reasonValue === 'type-of-fish') {
    return 400
  } else if (reasonValue === 'other') {
    return 500
  }
  // schema and actual page has differences
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
    path: `${Paths.FISHING_REPORTREASON}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_REPORTREASON_ANSWER}`,
    handler: handlers.post
  }
]
