import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'mud',
  route: constants.routes.MUD_LOCATION_ADDRESS,
  redirect: {
    description: constants.routes.MUD_DESCRIPTION
  }
})
