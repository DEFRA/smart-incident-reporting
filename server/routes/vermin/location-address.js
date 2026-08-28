import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_LOCATION_ADDRESS,
  redirect: {
    recurring: constants.routes.VERMIN_RECURRING
  }
})
