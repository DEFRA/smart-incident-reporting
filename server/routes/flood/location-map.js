import constants from '../../utils/constants.js'

const createLocationMap = {
  method: 'GET',
  path: constants.routes.FLOOD_LOCATION_MAP,
  handler: (_request, h) => {
    return h.view('flood/location-map')
  }
}
export default createLocationMap
