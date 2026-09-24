import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'dust',
  route: constants.routes.DUST_CHOOSE_ADDRESS,
  redirect: {
    confirmAddress: constants.routes.DUST_CONFIRM_ADDRESS,
    findAddress: constants.routes.DUST_FIND_ADDRESS,
    locationAddress: constants.routes.DUST_LOCATION_ADDRESS
  }
})
