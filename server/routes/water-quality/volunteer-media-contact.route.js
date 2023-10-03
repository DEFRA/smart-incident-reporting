'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')
const IncidentUtilsService = require('../../services/incident.service')
const ASBService = require('../../services/asb.send')
const config = require('../../utils/config')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_VOLUNTEER_MEDIA_CONTACT, {
      ...context
    })
  },
  post: async (request, h) => {
    const context = _getContext()

    const incidentToPost = await IncidentUtilsService.generateWaterIncidentJson2(request)
    if (config.submitIncident) {
      await ASBService.sendMessageToQueue(incidentToPost, 300)
    }
    return h.view(Views.SUCCESS, {
      ...context
    })
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
    path: `${Paths.WATER_TYPE_VOLUNTEER_MEDIA_CONTACT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_VOLUNTEER_MEDIA_CONTACT}`,
    handler: handlers.post
  }
]
