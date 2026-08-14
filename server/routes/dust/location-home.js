import constants from '../../utils/constants.js'
import createLocationHomeRoutes from '../rars/location-home.js'

export default createLocationHomeRoutes({
  problem: 'dust',
  route: constants.routes.DUST_LOCATION_HOME,
  redirect: {
    findAddress: constants.routes.DUST_FIND_ADDRESS,
    locationOption: constants.routes.DUST_LOCATION_OPTION
  }
})
