import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_LOCATION_ADDRESS,
  redirect: {
    description: constants.routes.NOISE_DESCRIPTION
  }
})
