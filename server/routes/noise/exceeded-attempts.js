import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  route: constants.routes.NOISE_EXCEEDED_ATTEMPTS,
  locationAddressRoute: constants.routes.NOISE_LOCATION_ADDRESS
})
