import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  route: constants.routes.DUST_EXCEEDED_ATTEMPTS,
  redirect: {
    locationAddress: constants.routes.DUST_LOCATION_ADDRESS
  }
})
