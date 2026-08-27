import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  route: constants.routes.SMELL_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.SMELL_DESCRIPTION,
    chooseAddress: constants.routes.SMELL_CHOOSE_ADDRESS,
    locationAddress: constants.routes.SMELL_LOCATION_ADDRESS
  }
})
