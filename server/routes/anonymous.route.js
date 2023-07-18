'use strict'

const { Paths, Views, RedisKeys } = require('../utils/constants')
const RedisService = require('../services/redis.service')
const IncidentUtilsService = require('../services/incident.service')
const ASBService = require('../services/asb.send')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.ANONYMOUS, {
      ...context
    })
  },
  post: async (request, h) => {
    const context = _getContext()
    const payload = request.payload
    RedisService.set(
      request,
      RedisKeys.ANONYMOUS_PAYLOAD,
      JSON.stringify(payload)
    )
    const incidentToPost = await IncidentUtilsService.generateIncidentJson(request)

    if (request.payload.anonymous === 'yes') {
      await ASBService.sendMessageToQueue(incidentToPost)
      return h.view(Views.SUCCESS, {
        ...context
      })
    } else if (request.payload.anonymous === 'no') {
      await ASBService.sendMessageToQueue(incidentToPost)
      return h.view(Views.UPDATES, {
        ...context
      })
    }
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
    path: `${Paths.ANONYMOUS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.ANONYMOUS_ANSWER}`,
    handler: handlers.post
  }
]
