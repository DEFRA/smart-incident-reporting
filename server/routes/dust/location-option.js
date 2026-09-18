import constants from '../../utils/constants.js'
import createLocationOptionRoutes from '../rars/location-option.js'

export default createLocationOptionRoutes({
  problem: 'dust',
  route: constants.routes.DUST_LOCATION_OPTION,
  redirect: {
    locationMap: constants.routes.DUST_LOCATION_MAP,
    locationDescription: constants.routes.DUST_LOCATION_DESCRIPTION
  }
})
