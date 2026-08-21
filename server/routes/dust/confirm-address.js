import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'dust',
  route: constants.routes.DUST_CONFIRM_ADDRESS
})
