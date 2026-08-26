import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  route: constants.routes.MUD_EXCEEDED_ATTEMPTS,
  locationAddressRoute: constants.routes.MUD_LOCATION_ADDRESS
})
