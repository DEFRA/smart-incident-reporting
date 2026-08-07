import constants from '../../utils/constants.js'
import createFindAddressRoutes from '../rars/find-address.js'

export default createFindAddressRoutes({
  problem: 'mud',
  route: constants.routes.MUD_FIND_ADDRESS
})
