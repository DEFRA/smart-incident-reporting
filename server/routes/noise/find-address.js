import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  route: constants.routes.NOISE_FIND_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.NOISE_CHOOSE_ADDRESS,
    exceededAttempts: constants.routes.NOISE_EXCEEDED_ATTEMPTS,
    locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
  }
})
