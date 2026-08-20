import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_LOCATION_DESCRIPTION,
  redirect: {
    recurring: constants.routes.SMELL_RECURRING
  }
})
