import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_CONFIRM_ADDRESS
})
