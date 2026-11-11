import constants from '../../utils/constants.js'
import createConfirmAddressRoutes from '../rars/confirm-address.js'

export default createConfirmAddressRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_CONFIRM_ADDRESS,
  redirect: {
    description: constants.routes.NOISE_DESCRIPTION,
    chooseAddress: constants.routes.NOISE_CHOOSE_ADDRESS,
    siteLocationOption: constants.routes.NOISE_SITE_LOCATION_OPTION,
    locationAddress: constants.routes.NOISE_LOCATION_ADDRESS
  }
})
