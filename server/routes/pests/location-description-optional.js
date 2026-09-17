import constants from '../../utils/constants.js'
import createLocationDescriptionOptionalRoutes from '../rars/location-description-optional.js'

export default createLocationDescriptionOptionalRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_LOCATION_DESCRIPTION_OPTIONAL,
  redirect: {
    recurring: constants.routes.PESTS_RECURRING
  }
})
