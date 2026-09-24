import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_EXCEEDED_ATTEMPTS,
  redirect: {
    locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
  }
})
