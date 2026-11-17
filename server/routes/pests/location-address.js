import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_LOCATION_ADDRESS,
  redirect: {
    chooseSite: constants.routes.PESTS_CHOOSE_SITE
  }
})
