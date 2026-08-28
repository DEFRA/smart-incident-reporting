import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_FIND_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.LITTER_CHOOSE_ADDRESS,
    exceededAttempts: constants.routes.LITTER_EXCEEDED_ATTEMPTS,
    locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
  }
})
