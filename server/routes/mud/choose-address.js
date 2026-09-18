import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'mud',
  route: constants.routes.MUD_CHOOSE_ADDRESS,
  redirect: {
    confirmAddress: constants.routes.MUD_CONFIRM_ADDRESS,
    findAddress: constants.routes.MUD_FIND_ADDRESS,
    locationAddress: constants.routes.MUD_LOCATION_ADDRESS
  }
})
