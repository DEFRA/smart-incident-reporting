import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_FIND_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.SMELL_CHOOSE_ADDRESS,
    exceededAttempts: constants.routes.SMELL_EXCEEDED_ATTEMPTS,
    locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
  }
})
