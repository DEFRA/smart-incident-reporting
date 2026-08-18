import constants from '../../utils/constants.js'
import createLocationOptionRoutes from '../rars/location-option.js'

export default createLocationOptionRoutes({
  problem: 'mud',
  route: constants.routes.MUD_LOCATION_OPTION,
  redirect: {
    locationMap: constants.routes.MUD_LOCATION_MAP,
    locationDescription: constants.routes.MUD_LOCATION_DESCRIPTION
  }
})
