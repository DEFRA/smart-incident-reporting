import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_EXCEEDED_ATTEMPTS,
  redirect: {
    locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS
  }
})
