import constants from '../../utils/constants.js'
import { findSuggestionsByQueryAndLocalityType } from '../../services/location.js'

const handler = (request, _h) => {
  const { location, localityType } = request.query
  if (location) {
    return findSuggestionsByQueryAndLocalityType(location, localityType)
  } else {
    return []
  }
}

export default {
  method: 'GET',
  path: constants.routes.API_LOCATION_SUGGESTIONS_LOCALITY,
  handler,
  options: {
    auth: false
  }
}
