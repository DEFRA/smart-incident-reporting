import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  route: constants.routes.LITTER_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.LITTER_DESCRIPTION,
    chooseAddress: constants.routes.LITTER_CHOOSE_ADDRESS,
    locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
  }
})
