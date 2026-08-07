import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'dust',
  route: constants.routes.DUST_FIND_ADDRESS
})
