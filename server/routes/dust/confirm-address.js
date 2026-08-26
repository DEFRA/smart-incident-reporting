import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'dust',
  route: constants.routes.DUST_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.DUST_DESCRIPTION,
    chooseAddress: constants.routes.DUST_CHOOSE_ADDRESS,
    locationAddress: constants.routes.DUST_LOCATION_ADDRESS
  }
})
