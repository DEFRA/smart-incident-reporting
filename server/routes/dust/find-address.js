import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  route: constants.routes.DUST_FIND_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.DUST_CHOOSE_ADDRESS,
    exceededAttempts: constants.routes.DUST_EXCEEDED_ATTEMPTS,
    locationAddress: constants.routes.DUST_LOCATION_ADDRESS
  }
})
