import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_CONFIRM_ADDRESS,
  redirect: {
    chooseAddress: constants.routes.PESTS_CHOOSE_ADDRESS,
    locationAddress: constants.routes.PESTS_LOCATION_ADDRESS,
    recurring: constants.routes.PESTS_RECURRING
  }
})
