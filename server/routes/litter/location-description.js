import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_LOCATION_DESCRIPTION,
  redirect: {
    description: constants.routes.LITTER_DESCRIPTION
  }
})
