import constants from '../../utils/constants.js'
import createLocationDescriptionRoutes from '../rars/location-description.js'

export default createLocationDescriptionRoutes({
  problem: 'mud',
  route: constants.routes.MUD_LOCATION_DESCRIPTION,
  redirect: {
    description: constants.routes.MUD_DESCRIPTION
  }
})
