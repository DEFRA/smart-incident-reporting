import constants from '../../utils/constants.js'
import createLocationDescriptionOptionalRoutes from '../rars/location-description-optional.js'

export default createLocationDescriptionOptionalRoutes({
  problem: 'dust',
  route: constants.routes.DUST_LOCATION_DESCRIPTION_OPTIONAL,
  redirect: {
    description: constants.routes.DUST_DESCRIPTION
  }
})
