import constants from '../../utils/constants.js'
import createLocationMapRoutes from '../rars/location-map.js'

export default createLocationMapRoutes({
  problem: 'dust',
  route: constants.routes.DUST_LOCATION_MAP,
  redirect: {
    locationDescriptionOptional: constants.routes.DUST_LOCATION_DESCRIPTION_OPTIONAL
  }
})
