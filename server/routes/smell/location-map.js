import constants from '../../utils/constants.js'
import createLocationMapRoutes from '../rars/location-map.js'

export default createLocationMapRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_LOCATION_MAP,
  redirect: {
    locationDescriptionOptional: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL
  }
})
