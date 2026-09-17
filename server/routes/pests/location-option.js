import constants from '../../utils/constants.js'
import createLocationOptionRoutes from '../rars/location-option.js'

export default createLocationOptionRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_LOCATION_OPTION,
  redirect: {
    locationMap: constants.routes.PESTS_LOCATION_MAP,
    locationDescription: constants.routes.PESTS_LOCATION_DESCRIPTION
  }
})
