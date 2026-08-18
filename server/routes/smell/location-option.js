import constants from '../../utils/constants.js'
import createLocationOptionRoutes from '../rars/location-option.js'

export default createLocationOptionRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_LOCATION_OPTION,
  redirect: {
    locationMap: constants.routes.SMELL_LOCATION_MAP,
    locationDescription: constants.routes.SMELL_LOCATION_DESCRIPTION
  }
})
