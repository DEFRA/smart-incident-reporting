import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_FIND_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.PESTS_CHOOSE_ADDRESS,
    exceededAttempts: constants.routes.PESTS_EXCEEDED_ATTEMPTS,
    locationAddress: constants.routes.PESTS_LOCATION_ADDRESS
  }
})
