import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  route: constants.routes.SMELL_EXCEEDED_ATTEMPTS,
  redirect: {
    locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
  }
})
