import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_LOCATION_ADDRESS,
  redirect: {
    recurring: constants.routes.PESTS_RECURRING
  }
})
