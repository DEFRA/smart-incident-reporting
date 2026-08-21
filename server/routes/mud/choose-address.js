import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'mud',
  route: constants.routes.MUD_CHOOSE_ADDRESS
})
