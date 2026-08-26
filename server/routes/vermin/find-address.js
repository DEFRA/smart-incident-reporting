import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_FIND_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.VERMIN_CHOOSE_ADDRESS,
    exceededAttempts: constants.routes.VERMIN_EXCEEDED_ATTEMPTS,
    locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS
  }
})
