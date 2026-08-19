import constants from '../../utils/constants.js'
import createLocationMapRoutes from '../rars/location-map.js'

export default createLocationMapRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_LOCATION_MAP,
  redirect: {
    locationDescriptionOptional: constants.routes.VERMIN_LOCATION_DESCRIPTION_OPTIONAL
  }
})
