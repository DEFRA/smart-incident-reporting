import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_LOCATION_DESCRIPTION,
  redirect: {
    sourceDetails: constants.routes.SMELL_SOURCE_DETAILS
  }
})
