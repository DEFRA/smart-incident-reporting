import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'dust',
  route: constants.routes.DUST_LOCATION_ADDRESS,
  redirect: {
    chooseSite: constants.routes.DUST_CHOOSE_SITE
  }
})
