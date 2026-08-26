import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  route: constants.routes.LITTER_EXCEEDED_ATTEMPTS,
  locationAddressRoute: constants.routes.LITTER_LOCATION_ADDRESS
})
