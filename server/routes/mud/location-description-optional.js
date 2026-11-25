import constants from '../../utils/constants.js'
import createLocationDescriptionOptionalRoutes from '../rars/location-description-optional.js'

export default createLocationDescriptionOptionalRoutes({
  problem: 'mud',
  route: constants.routes.MUD_LOCATION_DESCRIPTION_OPTIONAL,
  redirect: {
    chooseSite: constants.routes.MUD_CHOOSE_SITE
  }
})
