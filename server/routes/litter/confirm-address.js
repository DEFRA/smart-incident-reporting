import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.LITTER_DESCRIPTION,
    chooseAddress: constants.routes.LITTER_CHOOSE_ADDRESS,
    siteLocationOption: constants.routes.LITTER_SITE_LOCATION_OPTION,
    locationAddress: constants.routes.LITTER_LOCATION_ADDRESS
  }
})
