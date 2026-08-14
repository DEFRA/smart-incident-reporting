import constants from '../../utils/constants.js'
import createLocationHomeRoutes from '../rars/location-home.js'

export default createLocationHomeRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_LOCATION_HOME,
  redirect: {
    findAddress: constants.routes.NOISE_FIND_ADDRESS,
    locationOption: constants.routes.NOISE_LOCATION_OPTION
  }
})
