import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_EXCEEDED_ATTEMPTS,
  redirect: {
    locationAddress: constants.routes.PESTS_LOCATION_ADDRESS
  }
})
