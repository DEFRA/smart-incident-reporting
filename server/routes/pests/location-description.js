import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'pests',
  route: constants.routes.PESTS_LOCATION_DESCRIPTION,
  redirect: {
    recurring: constants.routes.PESTS_RECURRING
  }
})
