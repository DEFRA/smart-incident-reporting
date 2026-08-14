import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_FIND_ADDRESS
})
