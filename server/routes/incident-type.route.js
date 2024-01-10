import constants from '../utils/constants.js'
import RedisService from '../services/redis.service.js'
const { Paths, Views, RedisKeys } = constants

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.INCIDENT_TYPE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const incidenttype = request.payload['incident-type']

    RedisService.set(
      request,
      RedisKeys.INCIDENT_TYPE,
      incidenttype
    )

    if (incidenttype === 'waterpollution') {
      return h.view(Views.WATER_TYPE, { ...context })
    } else if (incidenttype === 'smells') {
      return h.view(Views.WATER_TYPE, { ...context })
    } else if (incidenttype === 'fishing') {
      return h.view(Views.FISHING_LOCATION, { ...context })
    }
    return h.view(Views.INCIDENT_TYPE, { ...context })
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
    path: `${Paths.INCIDENT_TYPE}`,
    handler: handlers.get
  }, {
    method: 'POST',
    path: `${Paths.INCIDENT_TYPE_ANSWER}`,
    handler: handlers.post
  }
]
