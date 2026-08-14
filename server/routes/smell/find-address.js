import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_FIND_ADDRESS
})
