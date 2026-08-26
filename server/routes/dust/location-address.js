import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  route: constants.routes.DUST_LOCATION_ADDRESS,
  redirect: {
    description: constants.routes.DUST_DESCRIPTION
  }
})
