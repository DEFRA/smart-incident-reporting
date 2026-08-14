import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_FIND_ADDRESS
})
