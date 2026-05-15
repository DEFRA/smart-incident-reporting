import constants from '../utils/constants.js'
import { localityTypes } from '../services/location.js'

const toLabel = localityType => localityType.replaceAll('_', ' ')

const handlers = {
  get: (_request, h) => h.view(constants.views.LOCATION_TYPE_SEARCH, {
    localityTypes: localityTypes.map(value => ({
      value,
      label: toLabel(value)
    }))
  })
}

export default [
  {
    method: 'GET',
    path: constants.routes.LOCATION_TYPE_SEARCH,
    handler: handlers.get
  }
]
