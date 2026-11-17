import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_LOCATION_ADDRESS,
  redirect: {
    chooseSite: constants.routes.LITTER_CHOOSE_SITE
  }
})
