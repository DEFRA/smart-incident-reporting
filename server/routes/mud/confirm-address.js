import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'mud',
  route: constants.routes.MUD_CONFIRM_ADDRESS
})
