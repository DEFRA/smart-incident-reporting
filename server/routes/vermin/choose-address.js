import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_CHOOSE_ADDRESS,
  redirect: {
    confirmAddress: constants.routes.VERMIN_CONFIRM_ADDRESS,
    findAddress: constants.routes.VERMIN_FIND_ADDRESS,
    locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS
  }
})
