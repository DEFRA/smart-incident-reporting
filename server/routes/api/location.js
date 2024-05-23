import constants from '../../utils/constants.js'
import { findByQuery } from '../../services/location.js'

const handler = (request, _h) => {
  const { location } = request.query
  if (location) {
    return findByQuery(location)
  } else {
    return {}
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
