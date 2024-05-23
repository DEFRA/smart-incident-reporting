import constants from '../../utils/constants.js'
import { findSuggestionsByQuery } from '../../services/location.js'

const handler = (request, _h) => {
  const { location } = request.query
  if (location) {
    return findSuggestionsByQuery(location)
  } else {
    return []
  }
}

export default {
  method: 'GET',
  path: constants.routes.API_LOCATION_SUGGESTIONS,
  handler,
  options: {
    auth: false
  }
}
