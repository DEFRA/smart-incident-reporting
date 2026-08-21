import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CHOOSE_ADDRESS
})
