import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_LOCATION_DESCRIPTION,
  redirect: {
    sourceDetails: constants.routes.NOISE_SOURCE_DETAILS
  }
})
