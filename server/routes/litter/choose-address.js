import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CHOOSE_ADDRESS
})
