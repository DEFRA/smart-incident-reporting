import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  route: constants.routes.VERMIN_LOCATION_ADDRESS,
  redirect: constants.routes.VERMIN_DESCRIPTION
})
