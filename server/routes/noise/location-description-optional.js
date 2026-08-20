import constants from '../../utils/constants.js'
import createLocationDescriptionOptionalRoutes from '../rars/location-description-optional.js'

export default createLocationDescriptionOptionalRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_LOCATION_DESCRIPTION_OPTIONAL,
  redirect: {
    description: constants.routes.NOISE_DESCRIPTION
  }
})
