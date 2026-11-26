import constants from '../../utils/constants.js'
import createLocationAddressRoutes from '../rars/location-address.js'

export default createLocationAddressRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_LOCATION_ADDRESS,
  redirect: {
    chooseSite: constants.routes.SMELL_CHOOSE_SITE
  }
})
