import constants from '../../utils/constants.js'
import createExceededAttemptsRoutes from '../rars/exceeded-attempts.js'

export default createExceededAttemptsRoutes({
  problem: 'mud',
  route: constants.routes.MUD_EXCEEDED_ATTEMPTS,
  redirect: {
    locationAddress: constants.routes.MUD_LOCATION_ADDRESS
  }
})
