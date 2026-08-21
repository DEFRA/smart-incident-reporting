import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  route: constants.routes.NOISE_LOCATION_ADDRESS,
  redirect: constants.routes.NOISE_DESCRIPTION
})
