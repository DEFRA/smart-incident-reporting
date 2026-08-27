import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CHOOSE_ADDRESS,
  redirect: {
    confirmAddress: constants.routes.LITTER_CONFIRM_ADDRESS,
    findAddress: constants.routes.LITTER_FIND_ADDRESS,
    locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
  }
})
