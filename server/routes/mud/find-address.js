import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'mud',
  route: constants.routes.MUD_FIND_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.MUD_CHOOSE_ADDRESS,
    exceededAttempts: constants.routes.MUD_EXCEEDED_ATTEMPTS,
    locationAddress: constants.routes.MUD_LOCATION_ADDRESS
  }
})
