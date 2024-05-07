import constants from '../../utils/constants.js'
import { findSuggestionsByQuery } from '../../services/location.js'

const handler = async (request, h) => {
  const { location } = request.query
  if (location) {
    const result = await findSuggestionsByQuery(location)
    return result
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
