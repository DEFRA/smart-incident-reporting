import constants from '../../utils/constants.js'
import { findByQuery } from '../../services/location.js'

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
  handler,
  options: {
    auth: false
  }
}
