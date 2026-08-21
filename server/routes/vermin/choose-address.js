import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_CHOOSE_ADDRESS
})
