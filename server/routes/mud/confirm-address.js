import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  route: constants.routes.MUD_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.MUD_DESCRIPTION,
    chooseAddress: constants.routes.MUD_CHOOSE_ADDRESS,
    locationAddress: constants.routes.MUD_LOCATION_ADDRESS
  }
})
