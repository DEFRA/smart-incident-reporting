import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  route: constants.routes.VERMIN_EXCEEDED_ATTEMPTS,
  locationAddressRoute: constants.routes.VERMIN_LOCATION_ADDRESS
})
