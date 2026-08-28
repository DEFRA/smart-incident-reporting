import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_EXCEEDED_ATTEMPTS,
  redirect: {
    locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
  }
})
