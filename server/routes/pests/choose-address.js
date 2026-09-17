import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_CHOOSE_ADDRESS,
  redirect: {
    confirmAddress: constants.routes.PESTS_CONFIRM_ADDRESS,
    findAddress: constants.routes.PESTS_FIND_ADDRESS,
    locationAddress: constants.routes.PESTS_LOCATION_ADDRESS
  }
})
