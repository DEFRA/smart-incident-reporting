import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_FIND_ADDRESS
})
