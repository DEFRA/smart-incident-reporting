import constants from '../../utils/constants.js'
import createChooseAddressRoutes from '../rars/choose-address.js'

export default createChooseAddressRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_CHOOSE_ADDRESS,
  redirect: {
    confirmAddress: constants.routes.SMELL_CONFIRM_ADDRESS,
    findAddress: constants.routes.SMELL_FIND_ADDRESS,
    locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
  }
})
