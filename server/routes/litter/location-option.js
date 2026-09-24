import constants from '../../utils/constants.js'
import createLocationOptionRoutes from '../rars/location-option.js'

export default createLocationOptionRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_LOCATION_OPTION,
  redirect: {
    locationMap: constants.routes.LITTER_LOCATION_MAP,
    locationDescription: constants.routes.LITTER_LOCATION_DESCRIPTION
  }
})
