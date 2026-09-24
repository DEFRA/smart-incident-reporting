import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'dust',
  route: constants.routes.DUST_LOCATION_DESCRIPTION,
  redirect: {
    description: constants.routes.DUST_DESCRIPTION
  }
})
