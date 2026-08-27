import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  route: constants.routes.NOISE_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.NOISE_DESCRIPTION,
    chooseAddress: constants.routes.NOISE_CHOOSE_ADDRESS,
    locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
  }
})
