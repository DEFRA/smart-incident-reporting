import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_CONFIRM_ADDRESS
})
