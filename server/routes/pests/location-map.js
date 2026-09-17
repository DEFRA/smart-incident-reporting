import constants from '../../utils/constants.js'
import createLocationMapRoutes from '../rars/location-map.js'

export default createLocationMapRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_LOCATION_MAP,
  redirect: {
    locationDescriptionOptional: constants.routes.PESTS_LOCATION_DESCRIPTION_OPTIONAL
  }
})
