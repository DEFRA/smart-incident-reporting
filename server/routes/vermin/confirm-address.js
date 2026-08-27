import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  route: constants.routes.VERMIN_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.VERMIN_DESCRIPTION,
    chooseAddress: constants.routes.VERMIN_CHOOSE_ADDRESS,
    locationAddress: constants.routes.VERMIN_LOCATION_ADDRESS
  }
})
