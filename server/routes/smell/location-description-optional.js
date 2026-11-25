import constants from '../../utils/constants.js'
import createLocationDescriptionOptionalRoutes from '../rars/location-description-optional.js'

export default createLocationDescriptionOptionalRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_LOCATION_DESCRIPTION_OPTIONAL,
  redirect: {
    chooseSite: constants.routes.SMELL_CHOOSE_SITE
  }
})
