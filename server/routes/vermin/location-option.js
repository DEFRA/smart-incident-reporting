import constants from '../../utils/constants.js'
import createLocationOptionRoutes from '../rars/location-option.js'

export default createLocationOptionRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_LOCATION_OPTION,
  redirect: {
    locationMap: constants.routes.VERMIN_LOCATION_MAP,
    locationDescription: constants.routes.VERMIN_LOCATION_DESCRIPTION
  }
})
