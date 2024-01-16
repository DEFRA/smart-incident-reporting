import constants from '../../utils/constants.js'
import { findByQuery } from '../../services/location.js'
// Important: this will need silverline rate limiting protection to stop malicious use

const handler = async (request, h) => {
  const { location } = request.query
  if (location) {
    const result = await findByQuery(location)
    return result
  }
}

export default {
  method: 'GET',
  path: constants.routes.API_LOCATION,
  handler
}