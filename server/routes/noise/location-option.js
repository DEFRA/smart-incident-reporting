import constants from '../../utils/constants.js'
import createLocationOptionRoutes from '../rars/location-option.js'

export default createLocationOptionRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_LOCATION_OPTION,
  redirect: {
    locationMap: constants.routes.NOISE_LOCATION_MAP,
    locationDescription: constants.routes.NOISE_LOCATION_DESCRIPTION
  }
})
