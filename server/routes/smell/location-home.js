import constants from '../../utils/constants.js'
import createLocationHomeRoutes from '../rars/location-home.js'

export default createLocationHomeRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_LOCATION_HOME,
  redirect: {
    findAddress: constants.routes.SMELL_FIND_ADDRESS,
    locationOption: constants.routes.SMELL_LOCATION_OPTION
  }
})
