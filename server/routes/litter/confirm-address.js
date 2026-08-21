import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CONFIRM_ADDRESS
})
