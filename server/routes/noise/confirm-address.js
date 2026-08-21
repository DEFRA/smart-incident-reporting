import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CONFIRM_ADDRESS
})
