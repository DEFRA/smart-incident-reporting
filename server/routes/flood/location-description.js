import constants from '../../utils/constants.js'

const createLocationDescription = {
  method: 'GET',
  path: constants.routes.FLOOD_LOCATION_DESCRIPTION,
  handler: (_request, h) => {
    return h.view('flood/location-description')
  }
}
export default createLocationDescription
