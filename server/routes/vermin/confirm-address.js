import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_CONFIRM_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.VERMIN_CHOOSE_ADDRESS,
    locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS,
    recurring: constants.routes.VERMIN_RECURRING
  }
})
