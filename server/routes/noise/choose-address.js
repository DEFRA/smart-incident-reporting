import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CHOOSE_ADDRESS,
  redirect: {
    confirmAddress: constants.routes.NOISE_CONFIRM_ADDRESS,
    findAddress: constants.routes.NOISE_FIND_ADDRESS,
    locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
  }
})
