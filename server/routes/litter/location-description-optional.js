import constants from '../../utils/constants.js'
import createLocationDescriptionOptionalRoutes from '../rars/location-description-optional.js'

export default createLocationDescriptionOptionalRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_LOCATION_DESCRIPTION_OPTIONAL,
  redirect: {
    description: constants.routes.LITTER_DESCRIPTION
  }
})
