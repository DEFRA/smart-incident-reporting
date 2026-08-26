import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'vermin',
  route: constants.routes.VERMIN_LOCATION_DESCRIPTION,
  redirect: {
    recurring: constants.routes.VERMIN_RECURRING
  }
})
