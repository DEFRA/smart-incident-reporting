import constants from '../../utils/constants.js'
import createLocationHomeRoutes from '../rars/location-home.js'

export default createLocationHomeRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_LOCATION_HOME,
  redirect: {
    findAddress: constants.routes.PESTS_FIND_ADDRESS,
    locationOption: constants.routes.PESTS_LOCATION_OPTION
  }
})
