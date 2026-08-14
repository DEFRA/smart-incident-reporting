import constants from '../../utils/constants.js'
import createLocationHomeRoutes from '../rars/location-home.js'

export default createLocationHomeRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_LOCATION_HOME,
  redirect: {
    findAddress: constants.routes.VERMIN_FIND_ADDRESS,
    locationOption: constants.routes.VERMIN_LOCATION_OPTION
  }
})
