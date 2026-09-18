import constants from '../../utils/constants.js'
import createLocationMapRoutes from '../rars/location-map.js'

export default createLocationMapRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_LOCATION_MAP,
  redirect: {
    locationDescriptionOptional: constants.routes.NOISE_LOCATION_DESCRIPTION_OPTIONAL
  }
})
