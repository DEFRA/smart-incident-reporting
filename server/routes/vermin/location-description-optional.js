import constants from '../../utils/constants.js'
import createLocationDescriptionOptionalRoutes from '../rars/location-description-optional.js'

export default createLocationDescriptionOptionalRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_LOCATION_DESCRIPTION_OPTIONAL,
  redirect: {
    recurring: constants.routes.VERMIN_RECURRING
  }
})
