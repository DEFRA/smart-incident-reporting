import constants from '../../utils/constants.js'
import createLocationMapRoutes from '../rars/location-map.js'

export default createLocationMapRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_LOCATION_MAP
})
